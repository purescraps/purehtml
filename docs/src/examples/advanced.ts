import { Example } from './example';

export const advanced: Example[] = [
  {
    name: 'Query Parameters',
    html: `<div>
  <a href="https://google.com/search?q=example+query+parameter">Google</a>
  <a href="https://duckduckgo.com/search?q=alternative+search+engines">DuckDuckGo</a>
  <a href="https://startpage.com/search?q=privacy+matters">StartPage</a>
  <a href="https://x.com/search?q=popular+today">X</a>
</div>`,
    config: `selector: a
type: array
items:
  transform: urlQueryParam(q)
transform: attr(href)
`,
  },
  {
    name: 'Person Details',
    html: `<div>
  <span id="first-name">John</span>
  <span data-kind="last-name">Doe</span>
  <span details-age>
  
    42
  
  </span>

  <!--
    this user is not a premium member so the premium
    membership badge does not appear in the HTML
  -->
  <!-- <span class="premium-member"> premium member badge </span> -->
</div>`,
    config: `selector: div
type: object
properties:
  firstName:
    selector: '#first-name'
  lastName:
    selector: span[data-kind="last-name"]
  age:
    selector: span[details-age]
    transform: [trim, number]
  isPremiumMember:
    selector: span.premium-member
    transform: exists
`,
  },
];
