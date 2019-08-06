<script>
import { Cloudinary, Transformation } from "cloudinary-core";
import { merge } from "../utils";
import { normalizeRest } from "../helpers/attributes";
import { ready } from "../mixins/ready";
import { mounted } from "../mixins/mounted";
import { cldAttrsInherited } from "../mixins/cldAttrsInherited";
import { cldAttrsOwned } from "../mixins/cldAttrsOwned";

/**
 * Generates a `picture` tag including the URL sources for the main formats
 * supported by web browsers (jpeg and webp by default).
 * Browsers can automatically select and play the image format that they best support,
 * and the image files are created dynamically when first accessed by your users.
 */
export default {
  name: "CldPicture",
  inheritAttrs: false,
  mixins: [ready, mounted, cldAttrsInherited, cldAttrsOwned],
  // REVIEW cldAttrsInherited -> cldParentState injects cldParentState which defaults to CldGlobalContextState
  // REVIEW cldAttrsInherited -> cldAttrs provides cldParentState: this.cldAttrsState

  // REVIEW cldAttrsOwned -> cldAttrs
  // REVIEW cldAttrs -> ready
  render(h) {
    return h(
      "picture",
      this.pictureOptions,
      this.sourcesAttrs
        .map(attrs => h("source", { key: attrs.mimeType, attrs }))
        .concat(h("img", merge({ key: "img" }, this.imageOptions)))
        .concat(this.$slots.default)
    );
  },
  props: {
    /**
     * The unique identifier of an uploaded image.
     */
    publicId: { type: String, default: "", required: true },
    /**
     * An array of the image sources to put into the tag.
     * Each element can have `min_width` , `max_with` and `transformation`.
     */
    sources: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Additional `<img>` tag attributes
     */
    img: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    pictureOptions() {
      const className = {
        "cld-picture": true
      };

      if (!this.isReady) {
        return { class: className };
      }

      const htmlAttrs = Transformation.new(
        this.cldAttrs.transformation
      ).toHtmlAttributes();

      return {
        class: className,
        attrs: merge(normalizeRest(this.$attrs), htmlAttrs)
      };
    },

    imageOptions() {
      const className = {
        "cld-picture_image": true
      };

      if (!this.isReady) {
        return { class: className };
      }

      const htmlAttrs = Transformation.new(
        this.cldAttrs.transformation
      ).toHtmlAttributes();

      return {
        class: className,
        attrs: merge(
          htmlAttrs.width ? { width: htmlAttrs.width } : null,
          htmlAttrs.height ? { height: htmlAttrs.height } : null,
          this.publicId
            ? {
                src: Cloudinary.new(this.cldAttrs.configuration).url(
                  this.publicId,
                  this.cldAttrs.transformation
                )
              }
            : {},
          this.img
        )
      };
    },

    sourcesAttrs() {
      if (!this.isReady) {
        return [];
      }

      return this.sources.map(({ transformation, min_width, max_width }) => {
        if (typeof transformation === "string") {
          transformation = { raw_transformation: transformation };
        }

        let sourceTransformation = new Transformation(
          this.cldAttrs.transformation
        )
          .chain()
          .fromOptions(transformation);
        const srcset = Cloudinary.new(this.cldAttrs.configuration).url(
          this.publicId,
          sourceTransformation
        );

        const mediaElements = [];
        if (max_width) {
          mediaElements.push(`(max-width: ${num2px(max_width)})`);
        }
        if (min_width) {
          mediaElements.push(`(min-width: ${num2px(min_width)})`);
        }

        return {
          srcset,
          media: mediaElements.join(" and ")
        };
      });
    }
  }
};

function num2px(n) {
  if (typeof n === "number") {
    return `${n}px`;
  }
  if (typeof n === "string") {
    return n;
  }
  return 0;
}
</script>
