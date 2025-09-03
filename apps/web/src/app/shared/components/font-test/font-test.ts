import { Component } from '@angular/core';

@Component({
  selector: 'neko-font-test',
  template: `
    <div class="font-test-container">
      <h1>Display Large (Noto Sans 400)</h1>
      <h2>Display Medium (Noto Sans 500)</h2>
      <h3>Display Small (Noto Sans 400)</h3>
      
      <p class="title-large">Title Large (Noto Sans 400)</p>
      <p class="title-medium">Title Medium (Noto Sans 500)</p>
      <p class="title-small">Title Small (Noto Sans 500)</p>
      
      <p class="body-large">Body Large (Noto Sans 400) - This is a paragraph with regular weight.</p>
      <p class="body-medium">Body Medium (Noto Sans 400) - This is a paragraph with regular weight.</p>
      <p class="body-small">Body Small (Noto Sans 400) - This is a paragraph with regular weight.</p>
      
      <p class="label-large">Label Large (Noto Sans 500)</p>
      <p class="label-medium">Label Medium (Noto Sans 500)</p>
      <p class="label-small">Label Small (Noto Sans 500)</p>
    </div>
  `,
  styles: `
    .font-test-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .font-test-container > * {
      margin-bottom: 1rem;
      border-left: 3px solid var(--color-primary, #007bff);
      padding-left: 1rem;
    }
  `
})
export class FontTestComponent {}
