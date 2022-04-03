import { EditableSpan } from "./EditableSpan";
import { action } from "@storybook/addon-actions";

export default {
  title: "Editable Span",
  component: EditableSpan,
};

const changeSpanValueCallback = action("Change value to: ");

export const EditableSpanBaseExample = () => {
  return (
    <EditableSpan value={"Start value"} onChange={changeSpanValueCallback} />
  );
};
