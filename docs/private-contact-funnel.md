# Private contact funnel

The contact funnel records aggregate counts in the free Cloudflare Workers Analytics Engine tier. It does not record form values or visitor identifiers.

## Recorded events

- `contact_view`
- `contact_start`
- `contact_submit_attempt`
- `contact_submit_success`
- `contact_submit_error`

The site's Cloudflare Pages Advanced Mode Worker accepts an object with exactly one property: an approved `event` value. The Analytics Engine data point repeats that event name as its index and blob. No name, email, message content, form value, URL, IP address, user agent, cookie, session ID, or device ID is written to the dataset.

The client sends events only from `evyatarhazan.com`, `www.evyatarhazan.com`, and `evyatar-hazan.github.io`. Local development and unknown hosts do not send analytics.

## Aggregate query

Run this read-only SQL in the Cloudflare Analytics Engine dashboard for dataset `portfolio_contact_funnel`:

```sql
SELECT
  blob1 AS event,
  COUNT() AS total
FROM portfolio_contact_funnel
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY event
ORDER BY event;
```

Compare adjacent event totals to identify where visitors leave the form flow. Analytics Engine retains data for three months. If the free plan's ingestion limit is reached, Cloudflare rejects excess data points; the contact form continues to work because tracking is fire-and-forget.

References:

- [Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/)
- [Analytics Engine limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/)
- [Analytics Engine Workers binding](https://developers.cloudflare.com/analytics/analytics-engine/get-started/)
