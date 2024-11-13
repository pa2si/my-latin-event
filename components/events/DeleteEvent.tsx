import { deleteEventAction } from "@/utils/actions";
import FormContainer from "../form/FormContainer";
import { IconButton } from "../form/Buttons";

const DeleteEvent = ({ eventId }: { eventId: string }) => {
  const deleteEvent = deleteEventAction.bind(null, { eventId });
  return (
    <FormContainer action={deleteEvent}>
      <IconButton actionType="delete" variant="outline" />
    </FormContainer>
  );
};

export default DeleteEvent;
