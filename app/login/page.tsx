import { LoginForm } from '@/components/auth/login-form';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <LoginForm />
      </Card>
    </main>
  );
}
