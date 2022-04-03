import {AddItemForm} from "./AddItemForm";
import {action} from "@storybook/addon-actions"

export default {
    title: "AddItemForm",
    component: AddItemForm,
    argTypes: { onClick: { action: 'clicked' } },
}

const callback = action("Add button was pressed")

export const AddItemFormBaseExample = () => {
    return <AddItemForm addItem={callback} />
}