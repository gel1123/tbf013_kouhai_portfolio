// https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
function handler(
  event: AWSCloudFrontFunction.Event
): AWSCloudFrontFunction.Response
  | AWSCloudFrontFunction.Request {

  // リクエストURLのドメイン部分
  var host = event.request.headers.host.value;

  if (event.request.uri.match(/^\/products\/recipe_memo\/.+/)) {
    var newUrl = `https://${host}/products/recipe_memo`;
    var response: AWSCloudFrontFunction.Response = {
      statusCode: 302,
      statusDescription: 'Found',
      headers: { location: { value: newUrl } }
    }
    return response; 
  }

  return event.request;
}