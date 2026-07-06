import fs from 'node:fs';
import path from 'node:path';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

type SummaryResult = {
  title: string;
  project: string;
  status: TestResult['status'];
  duration: number;
  message: string;
  stack: string;
};

class HtmlSummaryReporter implements Reporter {
  private readonly results: SummaryResult[] = [];
  private readonly outputPath = path.join(process.cwd(), 'playwright-report', 'automationexercise-playwright-summary.html');

  onTestEnd(test: TestCase, result: TestResult) {
    const projectName = test.parent.project()?.name ?? 'default';
    const error = result.error ?? result.errors[0];

    this.results.push({
      title: test.titlePath().filter(Boolean).join(' > '),
      project: projectName,
      status: result.status,
      duration: result.duration,
      message: this.stripAnsi(error?.message ?? ''),
      stack: this.stripAnsi(error?.stack ?? '')
    });
  }

  onEnd(result: FullResult) {
    fs.mkdirSync(path.dirname(this.outputPath), { recursive: true });
    fs.writeFileSync(this.outputPath, this.render(result), 'utf8');
    console.log(`HTML summary report created: ${path.relative(process.cwd(), this.outputPath)}`);
  }

  private render(result: FullResult) {
    const total = this.results.length;
    const passed = this.results.filter((item) => item.status === 'passed').length;
    const failed = this.results.filter((item) => item.status === 'failed' || item.status === 'timedOut' || item.status === 'interrupted').length;
    const skipped = this.results.filter((item) => item.status === 'skipped').length;
    const generatedAt = new Date().toLocaleString();
    const rows = this.results.map((item) => this.renderRow(item)).join('\n');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Automation Exercise Playwright Test Report</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #18212f;
      background: #f5f7fb;
    }

    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 28px;
    }

    .meta {
      color: #64748b;
      margin-bottom: 24px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(5, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .tile {
      background: #ffffff;
      border: 1px solid #dde5f0;
      border-radius: 8px;
      padding: 16px;
    }

    .label {
      color: #64748b;
      font-size: 13px;
      margin-bottom: 6px;
    }

    .value {
      font-size: 26px;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border: 1px solid #dde5f0;
      border-radius: 8px;
      overflow: hidden;
    }

    th, td {
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid #e7edf5;
    }

    th {
      background: #eef3f9;
      font-size: 13px;
      color: #334155;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .badge {
      display: inline-block;
      min-width: 82px;
      text-align: center;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 700;
      text-transform: capitalize;
    }

    .passed {
      background: #dcfce7;
      color: #166534;
    }

    .failed, .timedOut, .interrupted {
      background: #fee2e2;
      color: #991b1b;
    }

    .skipped {
      background: #e0f2fe;
      color: #075985;
    }

    .failure-row td {
      background: #fff7f7;
    }

    .failure-details {
      border-left: 4px solid #ef4444;
      padding: 4px 0 4px 14px;
    }

    .detail-label {
      color: #991b1b;
      font-size: 13px;
      font-weight: 700;
      margin: 8px 0 6px;
    }

    pre {
      white-space: pre-wrap;
      overflow-x: auto;
      margin: 0 0 10px;
      padding: 12px;
      border-radius: 6px;
      background: #1f2937;
      color: #f8fafc;
      font-size: 12px;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <main>
    <h1>Automation Exercise Playwright Test Report</h1>
    <div class="meta">Generated at ${this.html(generatedAt)}</div>

    <section class="summary">
      <div class="tile"><div class="label">Outcome</div><div class="value">${this.html(result.status)}</div></div>
      <div class="tile"><div class="label">Total</div><div class="value">${total}</div></div>
      <div class="tile"><div class="label">Passed</div><div class="value">${passed}</div></div>
      <div class="tile"><div class="label">Failed</div><div class="value">${failed}</div></div>
      <div class="tile"><div class="label">Skipped</div><div class="value">${skipped}</div></div>
    </section>

    <table>
      <thead>
        <tr>
          <th>Test Case</th>
          <th>Project</th>
          <th>Outcome</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </main>
</body>
</html>
`;
  }

  private renderRow(item: SummaryResult) {
    const statusClass = item.status;
    const details = item.status === 'failed' || item.status === 'timedOut' || item.status === 'interrupted'
      ? `
        <tr class="failure-row">
          <td colspan="4">
            <div class="failure-details">
              <div class="detail-label">Error message</div>
              <pre>${this.html(item.message || 'No error message captured.')}</pre>
              <div class="detail-label">Stack trace</div>
              <pre>${this.html(item.stack || 'No stack trace captured.')}</pre>
            </div>
          </td>
        </tr>`
      : '';

    return `
        <tr>
          <td>${this.html(item.title)}</td>
          <td>${this.html(item.project)}</td>
          <td><span class="badge ${statusClass}">${this.html(item.status)}</span></td>
          <td>${this.html(`${item.duration}ms`)}</td>
        </tr>${details}`;
  }

  private html(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  private stripAnsi(value: string) {
    return value.replace(/\u001b\[[0-9;]*m/g, '');
  }
}

export default HtmlSummaryReporter;
