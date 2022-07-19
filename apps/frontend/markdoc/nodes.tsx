import Code from "@/components/Code";

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
    render: Code,
    attributes: {
      language: {
        type: String,
      },
    },
  },
};

export default nodes;
