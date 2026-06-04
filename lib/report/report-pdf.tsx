import React from 'react'
import path from 'node:path'
import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ReportData } from './build-report-data'
import { format } from 'date-fns'
import { getCategoryDisplay, getDomainLabel } from '@/lib/constants/categories'

const LOGO_PATH = path.join(process.cwd(), 'public', 'brand', 'sinad-logo.svg')

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #333',
    paddingBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  disclaimer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 5,
    border: '1 solid #ffc107',
  },
  disclaimerText: {
    fontSize: 10,
    color: '#856404',
    lineHeight: 1.5,
  },
  screeningBox: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  logItem: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    marginBottom: 8,
  },
  logDate: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  logText: {
    fontSize: 9,
    color: '#555',
  },
  activityItem: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  activityText: {
    fontSize: 9,
    color: '#555',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
})

interface ReportPDFProps {
  data: ReportData
}

export function ReportPDF({ data }: ReportPDFProps) {
  const categoryDisplay = data.latestScreening
    ? getCategoryDisplay(data.latestScreening.category)
    : null
  const domainLabel = data.latestScreening
    ? getDomainLabel(data.latestScreening.dominant_domain)
    : null

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy')
    } catch {
      return dateString
    }
  }

  const formatGender = (gender: 'laki_laki' | 'perempuan') => {
    return gender === 'laki_laki' ? 'Laki-laki' : 'Perempuan'
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image does not support alt. */}
            <Image src={LOGO_PATH} style={styles.logo} />
            <View>
              <Text style={styles.title}>SINAD+</Text>
              <Text style={styles.subtitle}>{data.title}</Text>
              <Text style={styles.subtitle}>
                Dibuat: {formatDate(data.generatedAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Child Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Anak</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{data.childName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal Lahir:</Text>
            <Text style={styles.value}>{formatDate(data.birthDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jenis Kelamin:</Text>
            <Text style={styles.value}>{formatGender(data.gender)}</Text>
          </View>
        </View>

        {/* Latest Screening */}
        {data.latestScreening && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hasil Skrining Terbaru</Text>
            <View style={styles.screeningBox}>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal Skrining:</Text>
                <Text style={styles.value}>
                  {formatDate(data.latestScreening.completed_at)}
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <Text>Skor Inatensi: {data.latestScreening.inattention_score}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text>
                  Skor Hiperaktivitas/Impulsivitas:{' '}
                  {data.latestScreening.hyperactivity_impulsivity_score}
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <Text>Skor Total: {data.latestScreening.total_score}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Kategori:</Text>
                <Text style={styles.value}>{categoryDisplay?.label ?? data.latestScreening.category}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Domain Dominan:</Text>
                <Text style={styles.value}>
                  {domainLabel ?? data.latestScreening.dominant_domain}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Behavior Logs */}
        {data.logs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Catatan Perilaku ({data.logs.length})
            </Text>
            {data.logs.slice(0, 5).map((log) => (
              <View key={log.id} style={styles.logItem}>
                <Text style={styles.logDate}>{formatDate(log.log_date)}</Text>
                <Text style={styles.logText}>Mood: {log.mood}</Text>
                <Text style={styles.logText}>
                  Fokus: {log.focus_rating}/5 | Impulsivitas:{' '}
                  {log.impulsivity_rating}/5 | Kerjasama: {log.cooperation_rating}
                  /5
                </Text>
                {log.notes && (
                  <Text style={styles.logText}>Catatan: {log.notes}</Text>
                )}
              </View>
            ))}
            {data.logs.length > 5 && (
              <Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                ... dan {data.logs.length - 5} catatan lainnya
              </Text>
            )}
          </View>
        )}

        {/* Activities */}
        {data.activities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Aktivitas Pendampingan ({data.activities.length})
            </Text>
            {data.activities.slice(0, 3).map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityText}>
                  Domain: {activity.domain} | Durasi: {activity.duration_minutes}{' '}
                  menit
                </Text>
                <Text style={styles.activityText}>
                  Objektif: {activity.objective}
                </Text>
              </View>
            ))}
            {data.activities.length > 3 && (
              <Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                ... dan {data.activities.length - 3} aktivitas lainnya
              </Text>
            )}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{data.disclaimer}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Laporan ini dibuat oleh SINAD+ untuk keperluan konsultasi dengan tenaga
          profesional
        </Text>
      </Page>
    </Document>
  )
}
