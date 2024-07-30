import CatHealthTracker from '@/components/CatHealthTracker';
import RequestNotificationPermission from '@/utils/RequestNotificationPermission';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RequestNotificationPermission />
      <CatHealthTracker />
    </main>
  );
}