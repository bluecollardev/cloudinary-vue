import { mount } from "@vue/test-utils";
import CldTransformation from "../../src/components/CldTransformation.vue";
import CldImage from "../../src/components/CldImage.vue";

describe("CldImage with CldTransformation ", () => {
  it("renders", async () => {
    const wrapper = mount({
      template: `
        <cld-image cloudName="demo" publicId="face_top">
          <cld-transformation effect="sepia:20" />
        </cld-image>
      `,
      components: { CldTransformation, CldImage }
    });

    expect(wrapper.is("img")).toBe(true);
    expect(wrapper.attributes("src")).toEqual(
      `http://res.cloudinary.com/demo/image/upload/e_sepia:20/face_top`
    );
  });
});
