import { Example } from "./example";

const html=`<table>
<tbody>
  <tr class="athing submission" id="49643982">
    <td align="right" valign="top" class="title">
      <span class="rank">1.</span>
    </td>
    <td valign="top" class="votelinks">
      <center>
        <a id="up_49643982" href="vote?id=49643982&amp;how=up&amp;goto=news"
          ><div class="votearrow" title="upvote"></div
        ></a>
      </center>
    </td>
    <td class="title">
      <span class="titleline"
        ><a href="https://shopify.engineering/back-to-native"
          >Shopify moves back to Native from React Native</a
        ><span class="sitebit comhead">
          (<a href="from?site=shopify.engineering"
            ><span class="sitestr">shopify.engineering</span></a
          >)</span
        ></span
      >
    </td>
  </tr>
  <tr>
    <td colspan="2"></td>
    <td class="subtext">
      <span class="subline"
        ><span class="score" id="score_49643982">143 points</span> by
        <a href="user?id=fnthawar2" class="hnuser">fnthawar2</a>
        <span class="age" title="2026-09-10T14:09:31.000000Z"
          ><a href="item?id=49643982">53 minutes ago</a></span
        >
        <span id="unv_49643982"></span> |
        <a href="hide?id=49643982&amp;goto=news">hide</a> |
        <a href="item?id=49643982">75&nbsp;comments</a></span
      >
    </td>
  </tr>
  <tr class="spacer" style="height: 5px"></tr>
  <tr class="athing submission" id="49643546">
    <td align="right" valign="top" class="title">
      <span class="rank">2.</span>
    </td>
    <td valign="top" class="votelinks">
      <center>
        <a id="up_49643546" href="vote?id=49643546&amp;how=up&amp;goto=news"
          ><div class="votearrow" title="upvote"></div
        ></a>
      </center>
    </td>
    <td class="title">
      <span class="titleline"
        ><a
          href="https://rustfoundation.org/media/guest-post-rust-is-tier-1-language-at-microsoft/"
          >Rust Is Tier-1 Language at Microsoft</a
        ><span class="sitebit comhead">
          (<a href="from?site=rustfoundation.org"
            ><span class="sitestr">rustfoundation.org</span></a
          >)</span
        ></span
      >
    </td>
  </tr>
  <tr>
    <td colspan="2"></td>
    <td class="subtext">
      <span class="subline"
        ><span class="score" id="score_49643546">112 points</span> by
        <a href="user?id=mmastrac" class="hnuser">mmastrac</a>
        <span class="age" title="2026-09-10T13:39:16.000000Z"
          ><a href="item?id=49643546">1 hour ago</a></span
        >
        <span id="unv_49643546"></span> |
        <a href="hide?id=49643546&amp;goto=news">hide</a> |
        <a href="item?id=49643546">43&nbsp;comments</a></span
      >
    </td>
  </tr>
  <tr class="spacer" style="height: 5px"></tr>
  <tr class="athing submission" id="49644047">
    <td align="right" valign="top" class="title">
      <span class="rank">3.</span>
    </td>
    <td valign="top" class="votelinks">
      <center>
        <a id="up_49644047" href="vote?id=49644047&amp;how=up&amp;goto=news"
          ><div class="votearrow" title="upvote"></div
        ></a>
      </center>
    </td>
    <td class="title">
      <span class="titleline"
        ><a
          href="https://www.marketingdive.com/news/amazon-pilots-ad-services-in-chatgpt-what-marketers-need-to-know/829945/"
          >Amazon pilots ad services in ChatGPT</a
        ><span class="sitebit comhead">
          (<a href="from?site=marketingdive.com"
            ><span class="sitestr">marketingdive.com</span></a
          >)</span
        ></span
      >
    </td>
  </tr>
  <tr>
    <td colspan="2"></td>
    <td class="subtext">
      <span class="subline"
        ><span class="score" id="score_49644047">40 points</span> by
        <a href="user?id=thm" class="hnuser">thm</a>
        <span class="age" title="2026-09-10T14:13:09.000000Z"
          ><a href="item?id=49644047">49 minutes ago</a></span
        >
        <span id="unv_49644047"></span> |
        <a href="hide?id=49644047&amp;goto=news">hide</a> |
        <a href="item?id=49644047">19&nbsp;comments</a></span
      >
    </td>
  </tr>
  <tr class="spacer" style="height: 5px"></tr>
</tbody>
</table>
`;

const config = `# Hacker News PureHTML configuration
selector: tr.athing.submission

items:
  properties:
    id: { transform: attr(id) }
    title: { selector: span.titleline }
    url: { selector: 'span.titleline a:first-child', transform: [attr(href), resolve] }
    date: { selector: '+tr span.age', transform: attr(title) }
    score: { selector: '+tr span.score' }
    comments: { selector: '+tr span.age a', transform: attr(href) }
`;

export const hackernewsListing: Example = {
  name: 'Hacker News Listing Page',
  html,
  config,
};
