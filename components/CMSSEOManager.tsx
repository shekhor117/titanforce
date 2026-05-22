'use client'

import React, { useState, useEffect } from 'react'
import { getCMSService, type CMSPage, type CMSSEO } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Edit, Save } from 'lucide-react'

export default function CMSSEOManager() {
  const service = getCMSService()
  const [pages, setPages] = useState<CMSPage[]>([])
  const [seoData, setSeoData] = useState<Record<string, CMSSEO>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<CMSSEO>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const pagesData = await service.getPages(true)
      setPages(pagesData)

      // Load SEO data for each page
      const seoMap: Record<string, CMSSEO> = {}
      for (const page of pagesData) {
        const seo = await service.getSEOByPageId(page.id)
        if (seo) {
          seoMap[page.id] = seo
        }
      }
      setSeoData(seoMap)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pageId: string) => {
    const existingSeo = seoData[pageId]
    setEditingPageId(pageId)
    setFormData(existingSeo || { page_id: pageId })
  }

  const handleSave = async () => {
    try {
      if (!editingPageId) return

      let updated: CMSSEO
      if (seoData[editingPageId]) {
        updated = await service.updateSEO(seoData[editingPageId].id, formData)
      } else {
        updated = await service.createSEO(
          formData as Omit<CMSSEO, 'id' | 'created_at' | 'updated_at'>
        )
      }

      setSeoData({
        ...seoData,
        [editingPageId]: updated,
      })
      setEditingPageId(null)
      setFormData({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save SEO')
    }
  }

  const calculateMetaLength = (text: string | undefined) => {
    return text?.length || 0
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEO Management</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-600">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            No pages found.
          </div>
        ) : (
          pages.map((page) => {
            const seo = seoData[page.id]
            const isEditing = editingPageId === page.id

            return (
              <div
                key={page.id}
                className="p-4 bg-white border border-slate-200 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="text-sm text-slate-600">/{page.slug}</p>
                  </div>
                  {!isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(page.id)}
                      className="gap-1"
                    >
                      <Edit size={14} />
                      Edit SEO
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Meta Title */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Meta Title {calculateMetaLength(formData.meta_title)}/60
                      </label>
                      <Input
                        placeholder="Page meta title (recommended: 50-60 characters)"
                        value={formData.meta_title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_title: e.target.value,
                          })
                        }
                        maxLength={60}
                      />
                      <div className="text-xs text-slate-600 mt-1">
                        {calculateMetaLength(formData.meta_title)}/60
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Meta Description{' '}
                        {calculateMetaLength(formData.meta_description)}/160
                      </label>
                      <textarea
                        placeholder="Page meta description (recommended: 150-160 characters)"
                        value={formData.meta_description || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_description: e.target.value,
                          })
                        }
                        maxLength={160}
                        rows={2}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                      />
                      <div className="text-xs text-slate-600 mt-1">
                        {calculateMetaLength(formData.meta_description)}/160
                      </div>
                    </div>

                    {/* Meta Keywords */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Meta Keywords
                      </label>
                      <Input
                        placeholder="keyword1, keyword2, keyword3"
                        value={formData.meta_keywords || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_keywords: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* OG Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          OG Title
                        </label>
                        <Input
                          placeholder="Social media title"
                          value={formData.og_title || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              og_title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          OG Image URL
                        </label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={formData.og_image || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              og_image: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        OG Description
                      </label>
                      <textarea
                        placeholder="Social media description"
                        value={formData.og_description || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            og_description: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                      />
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Canonical URL
                      </label>
                      <Input
                        placeholder="https://example.com/page"
                        value={formData.canonical_url || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            canonical_url: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSave}
                        className="gap-1"
                      >
                        <Save size={14} />
                        Save SEO
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingPageId(null)
                          setFormData({})
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {seo ? (
                      <>
                        {seo.meta_title && (
                          <div>
                            <span className="font-medium text-slate-600">
                              Meta Title:
                            </span>
                            <p className="text-slate-900 truncate">
                              {seo.meta_title}
                            </p>
                          </div>
                        )}
                        {seo.meta_description && (
                          <div>
                            <span className="font-medium text-slate-600">
                              Meta Description:
                            </span>
                            <p className="text-slate-900 line-clamp-2">
                              {seo.meta_description}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary">No SEO data</Badge>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
