import { Suspense } from 'react';
import AppLayout from '../components/AppLayout';
import ToastProvider from '../components/ui/ToastProvider';
import DepartmentDetailContent from './components/DepartmentDetailContent';
import DepartmentDetailSkeleton from './components/DepartmentDetailSkeleton';

export default function DepartmentDetailPage() {
  return (
    <AppLayout>
      <ToastProvider />
      <Suspense fallback={<DepartmentDetailSkeleton />}>
        <DepartmentDetailContent />
      </Suspense>
    </AppLayout>
  );
}