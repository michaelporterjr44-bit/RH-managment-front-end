import AppLayout from '../components/AppLayout';
import ToastProvider from '../components/ui/ToastProvider';
import DepartmentListContent from './components/DepartmentListContent';

export default function DepartmentListPage() {
  return (
    <AppLayout>
      <ToastProvider />
      <DepartmentListContent />
    </AppLayout>
  );
}