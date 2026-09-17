import {
  type DocumentActionComponent,
  definePlugin,
  useDocumentOperation,
} from "sanity";

export const ApproveAndPublishAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const { published, draft } = props;
  const doc = (draft || published) as Record<string, unknown> | undefined;

  return {
    label: "Approve & Publish",
    icon: () => "🚀",
    title: "Set Free Plan Status to Approved and publish now with current date",
    onHandle: () => {
      const now = new Date().toISOString();
      const existingDate =
        typeof doc?.publishDate === "string" ? doc.publishDate : undefined;
      patch.execute([
        {
          set: {
            freePlanStatus: "approved",
            publishDate: existingDate || now,
          },
        },
      ]);
      publish.execute();
      props.onComplete();
    },
  };
};

export const SendNotificationEmailAction: DocumentActionComponent = (props) => {
  return {
    label: "Send notification email",
    icon: () => "📤",
    onHandle: async () => {
      const { published, draft } = props;
      const doc = draft || published;
      if (!doc) {
        console.error("SendNotificationEmailAction, no document found");
        return;
      }

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: doc._id,
          }),
        });

        if (!response.ok) {
          console.error("SendNotificationEmailAction, failed to send email");
          throw new Error("Failed to send email");
        }

        // Show success message
        console.log("SendNotificationEmailAction, email sent successfully");
        const data = await response.json();
        window.alert(data.message);
      } catch (error) {
        console.error("Error sending notification email:", error);
        window.alert("Failed to send notification email. Please try again.");
      }
    },
  };
};

export const customDocumentActionsPlugin = definePlugin({
  name: "custom-document-actions",
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "item") {
        return [...prev, ApproveAndPublishAction, SendNotificationEmailAction];
      }
      return prev;
    },
  },
});
