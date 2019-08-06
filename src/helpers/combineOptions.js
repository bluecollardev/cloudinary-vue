import { merge, compact } from "../utils";
// REVIEW what is the difference between utils and helpers?

/** Combines many objects
 * { publicId, configuration, transformation }
 * provided as arguments into one
 * @param  {...{ publicId, configuration, transformation }} options
 */
export function combineOptions(...options) {
  let publicId = null;
  for (let i = options.length - 1; !publicId && i >= 0; i--) {
    publicId = options[i] && options[i].publicId;
  }

  const configuration = compact(
    merge(...options.map(option => option && option.configuration))
  );

  const transformation = compact(
    combineTransformationComponents.apply(
      this,
      compact(compact(options).map(option => option.transformation))
    )
  );

  return compact({
    publicId,
    configuration: Object.keys(configuration).length
      ? configuration
      : undefined,
    transformation: Object.keys(transformation).length
      ? transformation
      : undefined
  });
}

/**
 * Combines many transformations
 * provided as arguments
 * into one
 * @param  {...object} transformationComponents
 */
export function combineTransformationComponents(...transformationComponents) {
  return compact(transformationComponents).reduce((result, item) => {
    const transformation = compact(
      [].concat(result.transformation).concat(item.transformation)
    );
    return merge(
      result,
      item,
      transformation.length === 0 ? {} : { transformation }
    );
  }, {});
}
