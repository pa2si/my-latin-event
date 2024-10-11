import { deleteMyEventAction } from '@/utils/actions';
import FormContainer from '../form/FormContainer';
import { IconButton } from '../form/Buttons';

const DeleteMyEvent = ({ eventId }: { eventId: string }) => {
  const deleteMyEvent = deleteMyEventAction.bind(null, { eventId });
  return (
    <FormContainer action={deleteMyEvent}>
      <IconButton actionType="delete" variant="outline" />
    </FormContainer>
  );
};

export default DeleteMyEvent;
