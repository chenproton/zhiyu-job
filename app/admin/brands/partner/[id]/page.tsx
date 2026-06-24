'use client'

import { use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Phone, Mail, MapPin, User, ImageIcon, FileText, Upload } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

const partnerData = {
  id: 'e001',
  name: '智途科技',
  intro: '专注于人工智能和大数据解决方案的高新技术企业，是国家级专精特新小巨人企业。',
  type: '平台企业',
  creditCode: '91320594MA1P7XXXX1',
  foundedYear: '2010',
  staffSize: '500 人',
  createdAt: '2010/1/15',
  updatedAt: '2024/6/20',
  college: '智能制造学院',
  contact: {
    name: '张明',
    phone: '13800138001',
    email: 'zhangming@zltech.com',
    address: '苏州市工业园区创业街100号',
  },
  certificates: {
    intellectual: ['发明专利证书', '软件著作权登记证书'],
    honors: ['高新技术企业证书', '专精特新小巨人证书'],
  },
}

export default function PartnerDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const data = { ...partnerData, id }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">{data.name}</h1>

        {/* 基本信息 */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">企业简介</h3>
              <p className="text-sm leading-relaxed text-slate-600">{data.intro}</p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">其他信息</h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-xs text-slate-400">企业类型</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">统一社会信用代码</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.creditCode}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">成立年份</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.foundedYear}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">员工规模</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.staffSize}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">创建时间</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.createdAt}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">更新时间</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.updatedAt}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">关联二级学院</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{data.college}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 联系信息 */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-900">联系信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">联系人：{data.contact.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{data.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{data.contact.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{data.contact.address}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 企业形象 */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Building2 className="h-4 w-4 text-slate-500" />
              企业形象
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">企业 Logo</div>
            <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-lg bg-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                <Upload className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 营业执照 */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <FileText className="h-4 w-4 text-slate-500" />
              营业执照
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 w-32 items-center justify-center rounded-lg bg-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 知识产权 */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <FileText className="h-4 w-4 text-slate-500" />
              知识产权
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {data.certificates.intellectual.map((name, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex h-40 w-32 items-center justify-center rounded-lg bg-slate-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                      <Upload className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">{name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 企业荣誉资质 */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <FileText className="h-4 w-4 text-slate-500" />
              企业荣誉资质
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {data.certificates.honors.map((name, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex h-40 w-32 items-center justify-center rounded-lg bg-slate-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                      <Upload className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">{name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
