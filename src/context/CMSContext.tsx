import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  SiteSettings,
  SectionConfig,
  Project,
  ServiceItem,
  SkillItem,
  SoftwareItem,
  ProcessStep,
  BeforeAfterItem,
  Testimonial,
  SocialLink,
  NavigationItem,
  MediaAsset,
  ContactMessage,
  SEOSettings,
  RevisionSnapshot,
} from '../types/database';
import { CMSService, isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CMSContextType {
  // Current active data for presentation
  settings: SiteSettings;
  sections: Record<string, SectionConfig>;
  projects: Project[];
  services: ServiceItem[];
  skills: SkillItem[];
  software: SoftwareItem[];
  processSteps: ProcessStep[];
  beforeAfter: BeforeAfterItem[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
  navItems: NavigationItem[];
  mediaAssets: MediaAsset[];
  contactMessages: ContactMessage[];
  seoSettings: SEOSettings;
  revisions: RevisionSnapshot[];
  lastPublished: string | null;

  // Mode & Flags
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  hasUnpublishedChanges: boolean;

  // Mutations
  updateSettings: (settings: SiteSettings) => void;
  updateSection: (sectionId: string, updates: Partial<SectionConfig>) => void;
  toggleSection: (sectionId: string, enabled: boolean) => void;
  saveProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  saveServices: (services: ServiceItem[]) => void;
  saveSkills: (skills: SkillItem[]) => void;
  saveSoftware: (software: SoftwareItem[]) => void;
  saveProcessSteps: (steps: ProcessStep[]) => void;
  saveBeforeAfter: (items: BeforeAfterItem[]) => void;
  saveTestimonials: (items: Testimonial[]) => void;
  saveSocialLinks: (links: SocialLink[]) => void;
  saveNavItems: (items: NavigationItem[]) => void;
  saveMedia: (media: MediaAsset[]) => void;
  addMedia: (media: MediaAsset) => void;
  deleteMedia: (id: string) => void;
  updateSEO: (seo: SEOSettings) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  submitContactForm: (msg: {
    name: string;
    email: string;
    project_type: string;
    budget: string;
    message: string;
  }) => Promise<{ success: boolean; error?: string }>;

  // Publishing & Safety
  publishChanges: () => void;
  saveDraft: () => void;
  resetSection: (sectionId: string) => void;
  resetEntireSite: () => void;
  restoreRevision: (rev: RevisionSnapshot) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();

  // Mode: In admin, default to previewing/editing drafts. For public visitors, show published.
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(true);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(false);
  const [lastPublished, setLastPublished] = useState<string | null>(CMSService.getLastPublished());

  // State instances
  const [settings, setSettings] = useState<SiteSettings>(() =>
    isAdmin ? CMSService.getDraftSettings() : CMSService.getPublishedSettings()
  );

  const [sections, setSections] = useState<Record<string, SectionConfig>>(() =>
    isAdmin ? CMSService.getDraftSections() : CMSService.getPublishedSections()
  );

  const [projects, setProjects] = useState<Project[]>(() => CMSService.getProjects());
  const [services, setServices] = useState<ServiceItem[]>(() => CMSService.getServices());
  const [skills, setSkills] = useState<SkillItem[]>(() => CMSService.getSkills());
  const [software, setSoftware] = useState<SoftwareItem[]>(() => CMSService.getSoftware());
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(() => CMSService.getProcessSteps());
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterItem[]>(() => CMSService.getBeforeAfter());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => CMSService.getTestimonials());
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => CMSService.getSocialLinks());
  const [navItems, setNavItems] = useState<NavigationItem[]>(() => CMSService.getNavigationItems());
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => CMSService.getMedia());
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => CMSService.getContactMessages());
  const [seoSettings, setSEOSettings] = useState<SEOSettings>(() =>
    isAdmin ? CMSService.getDraftSEO() : CMSService.getPublishedSEO()
  );
  const [revisions, setRevisions] = useState<RevisionSnapshot[]>(() => CMSService.getRevisions());

  // Fetch live published state from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadRemote() {
      const remote = await CMSService.fetchAllFromSupabase();
      if (!isMounted) return;
      if (remote.settings) setSettings(remote.settings);
      if (remote.sections && Object.keys(remote.sections).length > 0) setSections(remote.sections);
      if (remote.projects && remote.projects.length > 0) setProjects(remote.projects);
      if (remote.services && remote.services.length > 0) setServices(remote.services);
      if (remote.skills && remote.skills.length > 0) setSkills(remote.skills);
      if (remote.software && remote.software.length > 0) setSoftware(remote.software);
      if (remote.processSteps && remote.processSteps.length > 0) setProcessSteps(remote.processSteps);
      if (remote.beforeAfter && remote.beforeAfter.length > 0) setBeforeAfter(remote.beforeAfter);
      if (remote.testimonials && remote.testimonials.length > 0) setTestimonials(remote.testimonials);
      if (remote.socialLinks && remote.socialLinks.length > 0) setSocialLinks(remote.socialLinks);
      if (remote.navItems && remote.navItems.length > 0) setNavItems(remote.navItems);
      if (remote.mediaAssets && remote.mediaAssets.length > 0) setMediaAssets(remote.mediaAssets);
      if (remote.contactMessages && remote.contactMessages.length > 0) setContactMessages(remote.contactMessages);
      if (remote.seoSettings) setSEOSettings(remote.seoSettings);
      if (remote.revisions && remote.revisions.length > 0) setRevisions(remote.revisions);
    }
    loadRemote();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reload data when admin status or preview mode switches
  useEffect(() => {
    if (isAdmin) {
      if (isPreviewMode) {
        setSettings(CMSService.getDraftSettings());
        setSections(CMSService.getDraftSections());
        setSEOSettings(CMSService.getDraftSEO());
      } else {
        setSettings(CMSService.getPublishedSettings());
        setSections(CMSService.getPublishedSections());
        setSEOSettings(CMSService.getPublishedSEO());
      }
    } else {
      setSettings(CMSService.getPublishedSettings());
      setSections(CMSService.getPublishedSections());
      setSEOSettings(CMSService.getPublishedSEO());
    }
  }, [isAdmin, isPreviewMode]);

  // Apply dynamic document title & meta tags based on SEO settings
  useEffect(() => {
    if (seoSettings.page_title) {
      document.title = seoSettings.page_title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && seoSettings.meta_description) {
      metaDesc.setAttribute('content', seoSettings.meta_description);
    }
  }, [seoSettings]);

  // Mutations
  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    CMSService.saveDraftSettings(newSettings);
    setHasUnpublishedChanges(true);
  };

  const updateSection = (sectionId: string, updates: Partial<SectionConfig>) => {
    setSections((prev) => {
      const current = prev[sectionId] || {
        id: sectionId,
        name: sectionId,
        enabled: true,
        sort_order: 99,
        content: {},
      };
      const updated = {
        ...prev,
        [sectionId]: {
          ...current,
          ...updates,
          content: { ...current.content, ...(updates.content || {}) },
          updated_at: new Date().toISOString(),
        },
      };
      CMSService.saveDraftSections(updated);
      return updated;
    });
    setHasUnpublishedChanges(true);
  };

  const toggleSection = (sectionId: string, enabled: boolean) => {
    updateSection(sectionId, { enabled });
  };

  const handleSaveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    CMSService.saveProjects(newProjects);
    setHasUnpublishedChanges(true);
  };

  const addProject = (project: Project) => {
    const updated = [project, ...projects];
    handleSaveProjects(updated);
  };

  const updateProject = (project: Project) => {
    const updated = projects.map((p) => (p.id === project.id ? project : p));
    handleSaveProjects(updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    handleSaveProjects(updated);
    CMSService.deleteProjectRemote(id);
  };

  const handleSaveServices = (items: ServiceItem[]) => {
    setServices(items);
    CMSService.saveServices(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveSkills = (items: SkillItem[]) => {
    setSkills(items);
    CMSService.saveSkills(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveSoftware = (items: SoftwareItem[]) => {
    setSoftware(items);
    CMSService.saveSoftware(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveProcess = (items: ProcessStep[]) => {
    setProcessSteps(items);
    CMSService.saveProcessSteps(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveBeforeAfter = (items: BeforeAfterItem[]) => {
    setBeforeAfter(items);
    CMSService.saveBeforeAfter(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveTestimonials = (items: Testimonial[]) => {
    setTestimonials(items);
    CMSService.saveTestimonials(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
    CMSService.saveSocialLinks(links);
    setHasUnpublishedChanges(true);
  };

  const handleSaveNavItems = (items: NavigationItem[]) => {
    setNavItems(items);
    CMSService.saveNavigationItems(items);
    setHasUnpublishedChanges(true);
  };

  const handleSaveMedia = (assets: MediaAsset[]) => {
    setMediaAssets(assets);
    CMSService.saveMedia(assets);
  };

  const addMedia = (asset: MediaAsset) => {
    const updated = [asset, ...mediaAssets];
    handleSaveMedia(updated);
    CMSService.addMediaAsset(asset);
  };

  const deleteMedia = (id: string) => {
    const asset = mediaAssets.find((m) => m.id === id);
    const updated = mediaAssets.filter((m) => m.id !== id);
    handleSaveMedia(updated);
    CMSService.deleteMediaAsset(id, asset?.storage_path);
  };

  const handleUpdateSEO = (seo: SEOSettings) => {
    setSEOSettings(seo);
    CMSService.saveDraftSEO(seo);
    setHasUnpublishedChanges(true);
  };

  const markMessageRead = (id: string) => {
    const updated = contactMessages.map((m) =>
      m.id === id ? { ...m, status: 'read' as const } : m
    );
    setContactMessages(updated);
    CMSService.saveContactMessages(updated);
    CMSService.updateContactMessageStatus(id, 'read');
  };

  const deleteMessage = (id: string) => {
    const updated = contactMessages.filter((m) => m.id !== id);
    setContactMessages(updated);
    CMSService.saveContactMessages(updated);
    CMSService.deleteContactMessageRemote(id);
  };

  const submitContactForm = async (msg: {
    name: string;
    email: string;
    project_type: string;
    budget: string;
    message: string;
  }) => {
    const res = await CMSService.submitContactMessage(msg);
    if (res.success) {
      setContactMessages(CMSService.getContactMessages());
    }
    return res;
  };

  const publishChanges = async () => {
    const { timestamp } = await CMSService.publishChanges();
    setLastPublished(timestamp);
    setHasUnpublishedChanges(false);
    setRevisions(CMSService.getRevisions());
  };

  const saveDraft = () => {
    CMSService.saveDraftSettings(settings);
    CMSService.saveDraftSections(sections);
    CMSService.saveDraftSEO(seoSettings);
    setHasUnpublishedChanges(true);
  };

  const resetSection = (sectionId: string) => {
    const restored = CMSService.resetSection(sectionId);
    setSections((prev) => ({
      ...prev,
      [sectionId]: restored,
    }));
    setHasUnpublishedChanges(true);
  };

  const resetEntireSite = () => {
    CMSService.resetEntireSite();
    setSettings(CMSService.getDraftSettings());
    setSections(CMSService.getDraftSections());
    setProjects(CMSService.getProjects());
    setServices(CMSService.getServices());
    setSkills(CMSService.getSkills());
    setSoftware(CMSService.getSoftware());
    setProcessSteps(CMSService.getProcessSteps());
    setBeforeAfter(CMSService.getBeforeAfter());
    setTestimonials(CMSService.getTestimonials());
    setSocialLinks(CMSService.getSocialLinks());
    setNavItems(CMSService.getNavigationItems());
    setSEOSettings(CMSService.getDraftSEO());
    setRevisions(CMSService.getRevisions());
    setHasUnpublishedChanges(true);
  };

  const restoreRevision = (rev: RevisionSnapshot) => {
    CMSService.restoreRevision(rev);
    setSettings(rev.snapshot.site_settings);
    setSections(rev.snapshot.sections);
    setProjects(rev.snapshot.projects);
    setServices(rev.snapshot.services);
    setSkills(rev.snapshot.skills);
    setSoftware(rev.snapshot.software);
    setProcessSteps(rev.snapshot.process_steps);
    setBeforeAfter(rev.snapshot.before_after);
    setTestimonials(rev.snapshot.testimonials);
    setSocialLinks(rev.snapshot.social_links);
    setNavItems(rev.snapshot.navigation_items);
    setSEOSettings(rev.snapshot.seo_settings);
    setHasUnpublishedChanges(true);
  };

  return (
    <CMSContext.Provider
      value={{
        settings,
        sections,
        projects,
        services,
        skills,
        software,
        processSteps,
        beforeAfter,
        testimonials,
        socialLinks,
        navItems,
        mediaAssets,
        contactMessages,
        seoSettings,
        revisions,
        lastPublished,
        isPreviewMode,
        setIsPreviewMode,
        hasUnpublishedChanges,
        updateSettings,
        updateSection,
        toggleSection,
        saveProjects: handleSaveProjects,
        addProject,
        updateProject,
        deleteProject,
        saveServices: handleSaveServices,
        saveSkills: handleSaveSkills,
        saveSoftware: handleSaveSoftware,
        saveProcessSteps: handleSaveProcess,
        saveBeforeAfter: handleSaveBeforeAfter,
        saveTestimonials: handleSaveTestimonials,
        saveSocialLinks: handleSaveSocialLinks,
        saveNavItems: handleSaveNavItems,
        saveMedia: handleSaveMedia,
        addMedia,
        deleteMedia,
        updateSEO: handleUpdateSEO,
        markMessageRead,
        deleteMessage,
        submitContactForm,
        publishChanges,
        saveDraft,
        resetSection,
        resetEntireSite,
        restoreRevision,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
