export const SUBSCRIBED = "Subscribed email"
export const GITPOD_CLICKS = "Gitpod clicked amount"
export const GITHUB_CLICKS = "Github clicked amount"

function getQueryParam(url:string, param:string) {
  // Expects a raw URL
  param = param.replace(/[[]/, "\[").replace(/[]]/, "\]");
  let regexS = "[\?&]" + param + "=([^&#]*)",
      regex = new RegExp( regexS ),
      results = regex.exec(url);
  if (results === null || (results && typeof(results[1]) !== 'string')) {
    return '';
  } 
  return decodeURIComponent(results[1]).replace(/\W/gi, ' ');
}

export function campaignParams(mixpanel: any) {
  var campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' ')
      , kw = ''
      , params = {}
      , first_params = {};
  var index;
  for (index = 0; index < campaign_keywords.length; ++index) {
    kw = getQueryParam(document.URL, campaign_keywords[index]);
    if (kw.length) {
      params[campaign_keywords[index] + ' [last touch]'] = kw;
    }
  }
  for (index = 0; index < campaign_keywords.length; ++index) {
    kw = getQueryParam(document.URL, campaign_keywords[index]);
    if (kw.length) {
      first_params[campaign_keywords[index] + ' [first touch]'] = kw;
    }
  }
  mixpanel.people.set(params);
  mixpanel.people.set_once(first_params);
  mixpanel.register(params);
}