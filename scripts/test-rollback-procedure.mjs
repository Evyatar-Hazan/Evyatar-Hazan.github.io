import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const temporaryRoot = mkdtempSync(join(tmpdir(), 'portfolio-rollback-'))
const remotePath = join(temporaryRoot, 'remote.git')
const repositoryPath = join(temporaryRoot, 'repository')

const git = (args, options = {}) => {
  const output = execFileSync('git', args, {
    cwd: repositoryPath,
    encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'ignore',
  })

  return typeof output === 'string' ? output.trim() : ''
}

try {
  execFileSync('git', ['init', '--bare', remotePath], { stdio: 'ignore' })
  execFileSync('git', ['--git-dir', remotePath, 'config', 'receive.denyNonFastForwards', 'true'])

  mkdirSync(repositoryPath)
  execFileSync('git', ['init', '--initial-branch=main'], {
    cwd: repositoryPath,
    stdio: 'ignore',
  })
  git(['config', 'user.name', 'Rollback Rehearsal'])
  git(['config', 'user.email', 'rollback-rehearsal@example.invalid'])
  git(['remote', 'add', 'origin', remotePath])

  const fixturePath = join(repositoryPath, 'release.txt')
  writeFileSync(fixturePath, 'known-good\n')
  git(['add', 'release.txt'])
  git(['commit', '-m', 'release: known good'])
  const knownGoodSha = git(['rev-parse', 'HEAD'], { capture: true })
  const knownGoodTree = git(['rev-parse', 'HEAD^{tree}'], { capture: true })
  git(['push', '--set-upstream', 'origin', 'main'])

  writeFileSync(fixturePath, 'simulated-regression\n')
  git(['commit', '-am', 'release: simulated regression'])
  const failingSha = git(['rev-parse', 'HEAD'], { capture: true })
  git(['push', 'origin', 'main'])

  git(['switch', '--create', 'rollback/rehearsal'])
  git(['revert', '--no-edit', failingSha])
  const revertSha = git(['rev-parse', 'HEAD'], { capture: true })
  git(['push', '--set-upstream', 'origin', 'rollback/rehearsal'])

  git(['switch', 'main'])
  git(['merge', '--no-ff', 'rollback/rehearsal', '-m', 'Merge rollback rehearsal'])
  const rollbackMergeSha = git(['rev-parse', 'HEAD'], { capture: true })
  git(['push', 'origin', 'main'])

  const remoteMainSha = git(['--git-dir', remotePath, 'rev-parse', 'refs/heads/main'], {
    capture: true,
  })
  const remoteMainTree = git(['--git-dir', remotePath, 'rev-parse', 'refs/heads/main^{tree}'], {
    capture: true,
  })

  if (remoteMainSha !== rollbackMergeSha) {
    throw new Error('Remote main did not advance to the rollback merge commit.')
  }
  if (remoteMainTree !== knownGoodTree) {
    throw new Error('Rollback did not restore the last known-good tree.')
  }

  git(['merge-base', '--is-ancestor', failingSha, remoteMainSha])
  git(['merge-base', '--is-ancestor', revertSha, remoteMainSha])

  console.log(
    `Rollback rehearsal passed: restored tree from ${knownGoodSha.slice(0, 12)} with new merge ${remoteMainSha.slice(0, 12)}; published history remained intact.`,
  )
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
