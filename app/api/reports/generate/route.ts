import React from 'react'
import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { getDemoChild, getLatestScreening, getBehaviorLogs, getActivities } from '@/lib/supabase/queries'
import { buildReportData } from '@/lib/report/build-report-data'
import { ReportPDF } from '@/lib/report/report-pdf'

export async function GET() {
  try {
    // Fetch all data needed for report
    const child = await getDemoChild()
    const latestScreening = await getLatestScreening(child.id)
    const logs = await getBehaviorLogs(child.id)
    const activities = await getActivities()

    // Build report data
    const reportData = buildReportData({
      child,
      screenings: latestScreening ? [latestScreening] : [],
      logs,
      activities,
    })

    // Render PDF
    const stream = await renderToStream(React.createElement(ReportPDF, { data: reportData }))

    // Generate filename with child name and date
    const date = new Date().toISOString().split('T')[0]
    const filename = `Laporan-${child.name.replace(/\s+/g, '-')}-${date}.pdf`

    // Return PDF response
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating report PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate report PDF' },
      { status: 500 }
    )
  }
}
