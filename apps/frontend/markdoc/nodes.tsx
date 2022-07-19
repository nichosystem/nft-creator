import { Fence } from "@/components/docs/Fence";

const nodes = {
  document: {
    render: undefined,
  },
  th: {
    attributes: {
      scope: {
        type: String,
        default: "col",
      },
    },
    render: (props: any) => <th {...props} />,
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
};

export default nodes;
