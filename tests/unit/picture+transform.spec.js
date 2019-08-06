import Vue from "vue";
import { mount } from "@vue/test-utils";
import CldPicture from "../../src/components/CldPicture.vue";
import CldTransformation from "../../src/components/CldTransformation.vue";
import { sourcesOfPicture } from "./sourcesOfPicture";

describe("CldPicture", () => {
  it("allows transformation from CldTransformation", async () => {
    const picture = mount({
      template: `
        <cld-picture cloudName="demo" publicId="face_top" :sources="[{ min_width: 100, transformation: {} }]">
          <cld-transformation effect="sepia" />
        </cld-picture>
      `,
      components: { CldPicture, CldTransformation }
    });

    await Vue.nextTick();

    expect(picture.is("picture")).toBe(true);
    expect(picture.findAll("img").length).toBe(1);
    expect(picture.find("img").attributes("src")).toBe(
      "http://res.cloudinary.com/demo/image/upload/e_sepia/face_top"
    );
    expect(sourcesOfPicture(picture)).toEqual({
      "(min-width: 100px)": "http://res.cloudinary.com/demo/image/upload/face_top"
    });
  });
});
