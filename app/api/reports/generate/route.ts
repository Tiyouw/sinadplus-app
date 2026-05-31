import React from 'react'
import { NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { buildReportData } from '@/lib/report/build-report-data'
import { ReportPDF } from '@/lib/report/report-pdf'
import { getActivities, getBehaviorLogs, getDemoChild, getLatestScreening } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

function sanitizeFilenamePart(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'anak-demo'
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const child = await getDemoChild()
    const latestScreening = await getLatestScreening(child.id)
    const logs = await getBehaviorLogs(child.id)
    const activities = await getActivities()

    const reportData = buildReportData({
      child,
      screenings: latestScreening ? [latestScreening] : [],
      logs,
      activities,
    })

    const reportDocument = React.createElement(ReportPDF, { data: reportData }) as React.ReactElement<DocumentProps>
    const pdfBuffer = await renderToBuffer(reportDocument)
    const date = new Date().toISOString().split('T')[0]
    const filename = `Laporan-${sanitizeFilenamePart(child.name)}-${date}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating report PDF:', error)
    return NextResponse.json(
      { error: 'Gagal membuat laporan PDF.' },
      { status: 500 },
    )
  }
}
