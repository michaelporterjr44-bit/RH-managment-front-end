import { redirect } from 'next/navigation';

export default function RootPage() {
    redirect('/department/department-list');
}