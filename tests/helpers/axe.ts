import axe from 'axe-core';
import { expect } from 'vitest';

/** Fails when axe reports any serious or critical violation inside `container`. */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    // jsdom cannot compute colors or layout.
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );
  expect(
    blocking.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.html).join(' | ')}`),
  ).toEqual([]);
}
