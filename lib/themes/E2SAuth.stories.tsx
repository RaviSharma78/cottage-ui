import type { Meta, StoryObj } from "@storybook/react";
import { E2SAuth } from "./E2SAuth";

const meta: Meta<typeof E2SAuth> = {
    title: "Components/E2SAuth", // Add a meaningful title
    component: E2SAuth,
};

export default meta;

type Story = StoryObj<typeof E2SAuth>;

export const Default: Story = {
    args: {
        children: <div>Example Child Content</div>, // Pass JSX or string as children
    },
};
