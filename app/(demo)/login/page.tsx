import { signInDemo } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DemoLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Demo SINAD+</CardTitle>
          <CardDescription className="text-base">
            Masuk ke akun demo untuk menjelajahi fitur SINAD+ dengan data fiktif yang telah disiapkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInDemo} className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium mb-2">Tentang Data Demo:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Semua data bersifat fiktif dan tidak terkait dengan individu nyata</li>
                <li>Data direset secara berkala</li>
                <li>Anda dapat menjelajahi semua fitur tanpa risiko</li>
              </ul>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Masuk Demo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
