/**
 * Injects cloudinary parent State (stateful stream)
 */
export const cldParentState = {
  inject: {
    cldParentState: {
      default() {
        return this.CldGlobalContextState;
      }
    }
  }
};
