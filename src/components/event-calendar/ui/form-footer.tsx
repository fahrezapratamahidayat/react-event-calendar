import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

type FormFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  isSubmitting: boolean;
  cancelText?: string;
  saveText?: string;
  savingText?: string;
};

export const FormFooter = ({
  onCancel,
  onSave,
  isSubmitting,
  cancelText = 'Cancel',
  saveText = 'Save',
  savingText = 'Saving...',
}: FormFooterProps) => (
  <div className="flex flex-row gap-2">
    <Button variant="outline" onClick={onCancel} className="cursor-pointer">
      <X className="h-4 w-4" />
      {cancelText}
    </Button>
    <Button onClick={onSave} className="cursor-pointer" disabled={isSubmitting}>
      <Save className="h-4 w-4" />
      {isSubmitting ? savingText : saveText}
    </Button>
  </div>
);
