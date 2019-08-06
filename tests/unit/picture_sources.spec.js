import Vue from "vue";
import { mount } from "@vue/test-utils";
import CldPicture from "../../src/components/CldPicture.vue";
import { sourcesOfPicture } from "./sourcesOfPicture";

describe("CldPicture", () => {
  it("allows transformation for each source", async () => {
    const picture = mount({
      template: `
        <cld-picture
            cloudName="demo" publicId="face_top" crop="fill" height="100" width="399"
            :sources="[
                { max_width: 600, transformation: { effect: 'e1' } },
                { min_width: '60vw', transformation: { effect: 'e2' } }
            ]"
        />
      `,
      components: { CldPicture }
    });

    await Vue.nextTick();

    expect(picture.is("picture")).toBe(true);
    expect(picture.findAll("img").length).toBe(1);
    expect(picture.find("img").attributes("src")).toBe(
      "http://res.cloudinary.com/demo/image/upload/c_fill,h_100,w_399/face_top"
    );
    expect(sourcesOfPicture(picture)).toEqual({
      "(max-width: 600px)":
        "http://res.cloudinary.com/demo/image/upload/c_fill,h_100,w_399/e_e1/face_top",
      "(min-width: 60vw)":
        "http://res.cloudinary.com/demo/image/upload/c_fill,h_100,w_399/e_e2/face_top"
    });
  });
});
