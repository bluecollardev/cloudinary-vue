export function sourcesOfPicture(element) {
  const sources = element.findAll("source");
  return sources.wrappers.reduce((result, source) => {
    let { media, srcset } = source.attributes();
    result[media] = srcset;
    return result;
  }, {});
}
