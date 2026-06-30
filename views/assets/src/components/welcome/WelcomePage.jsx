import { __ } from '@wordpress/i18n';
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  ListChecks,
  Milestone,
  FolderOpen,
  Play,
  Rocket,
  BookOpen,
  Crown,
  Sparkles,
  Package,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const assetsUrl = typeof PM_Vars !== 'undefined' ? PM_Vars.assets_url : ''

function getAssetUrl(path) {
  return assetsUrl + path
}

const getFeatures = () => [
  {
    name: __('Overview', 'wedevs-project-manager'),
    description: __('In the overview section you will get a complete picture of your project. A chart for what has been done in the last 30 days, no of discussion, task lists, milestones and more.', 'wedevs-project-manager'),
    video: 'rliDPp4sIyM',
    thumb: 'overview-thumb.jpg',
    icon: LayoutDashboard,
    bg: '#DEEBFB',
    fg: 'text-blue-500',
  },
  {
    name: __('Activities', 'wedevs-project-manager'),
    description: __('You will also get a complete activity log history from the activities section of your project. All the activity will also be divided by date so it is easier to keep track.', 'wedevs-project-manager'),
    video: 'KarLsZ8FPQQ',
    thumb: 'activities-thumb.jpg',
    icon: Activity,
    bg: '#E3DBEA',
    fg: 'text-purple-500',
  },
  {
    name: __('Team Discussion', 'wedevs-project-manager'),
    description: __('There is a built-in discussion panel right inside your projects. Consisting open, group discussion feature. Making team collaboration much more effective.', 'wedevs-project-manager'),
    video: 'uCXHBIa-1Eg',
    thumb: 'discussion-thumb.jpg',
    icon: MessageSquare,
    bg: '#E5E7FD',
    fg: 'text-indigo-500',
  },
  {
    name: __('To-do Lists', 'wedevs-project-manager'),
    description: __('In your projects you get a separate Task List tab to divide your work. You will be able to set due date for a task, set milestone, categorize and more.', 'wedevs-project-manager'),
    video: 'mZS-GWiB1WQ',
    thumb: 'task-thumb.jpg',
    icon: ListChecks,
    bg: '#DFF7CE',
    fg: 'text-green-500',
  },
  {
    name: __('Milestone', 'wedevs-project-manager'),
    description: __('In the Milestones tab you will be able to set a specific milestone you want to reach. Set the name, due date, details. You will also see tasks set under each milestone.', 'wedevs-project-manager'),
    video: 'umJozhMjkho',
    thumb: 'milestone-thumb.jpg',
    icon: Milestone,
    bg: '#F2EBDF',
    fg: 'text-amber-600',
  },
  {
    name: __('Manage Files', 'wedevs-project-manager'),
    description: __("You don't need to rely on a separate file manager. WP Project Manager's Files feature will let you store all your files and see it in one place.", 'wedevs-project-manager'),
    video: 'i1F3MNwrJbM',
    thumb: 'file-thumb.jpg',
    icon: FolderOpen,
    bg: '#DAEEF0',
    fg: 'text-teal-500',
  },
]

const getResources = () => [
  {
    title: __('Upgrade', 'wedevs-project-manager'),
    description: __('Get upgraded to Pro version to unlock endless opportunities of managing your project better.', 'wedevs-project-manager'),
    buttonLabel: __('Upgrade to Pro', 'wedevs-project-manager'),
    buttonUrl: 'https://wedevs.com/wp-project-manager-pro/pricing/',
    icon: Crown,
  },
  {
    title: __('Pro Features', 'wedevs-project-manager'),
    description: __('Enhance your project management performance with extended features in the pro version.', 'wedevs-project-manager'),
    buttonLabel: __('View Pro Features', 'wedevs-project-manager'),
    buttonUrl: 'https://wedevs.com/wp-project-manager-pro/extensions/',
    icon: Sparkles,
  },
  {
    title: __('Module', 'wedevs-project-manager'),
    description: __('Check out all the useful modules that would take your project management experience to a whole new level.', 'wedevs-project-manager'),
    buttonLabel: __('Go to Modules', 'wedevs-project-manager'),
    buttonUrl: 'https://wedevs.com/wp-project-manager-pro/extensions/',
    icon: Package,
  },
]

function VideoModal({ open, onOpenChange, videoId }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden bg-black border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Video</DialogTitle>
        </DialogHeader>
        {open && (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}/?VQ=HD1080&autoplay=1&rel=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Feature video"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function FeatureCard({ feature, __, index = 0 }) {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      <VideoModal
        open={videoOpen}
        onOpenChange={setVideoOpen}
        videoId={feature.video}
      />
      <Card
        className="group overflow-hidden border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'both' }}
      >
        <div
          className="relative cursor-pointer"
          onClick={() => setVideoOpen(true)}
          style={{ background: feature.bg }}
        >
          <img
            src={getAssetUrl('images/welcome/' + feature.thumb)}
            alt={feature.name}
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <CardContent className="p-5 text-center">
          <div
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl mb-3 mx-auto transition-transform duration-300 group-hover:scale-110"
            style={{ background: feature.bg }}
          >
            <feature.icon className={`h-5 w-5 ${feature.fg}`} />
          </div>
          <h3 className="text-base font-semibold text-pm-text-primary mb-2">
            {feature.name}
          </h3>
          <p className="text-sm text-pm-text-muted leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="text-center mb-8">
      {kicker && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          {kicker}
        </span>
      )}
      <h2 className="text-2xl font-bold text-pm-text-primary mb-2">{title}</h2>
      {subtitle && (
        <p className="text-sm text-pm-text-muted max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default function WelcomePage() {
  const navigate = useNavigate()
  const [bannerVideoOpen, setBannerVideoOpen] = useState(false)
  const FEATURES = useMemo(() => getFeatures(), [])
  const RESOURCES = useMemo(() => getResources(), [])

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-12">
      {/* ── Hero Banner ── */}
      <VideoModal
        open={bannerVideoOpen}
        onOpenChange={setBannerVideoOpen}
        videoId="rliDPp4sIyM"
      />

      <div className="relative rounded-2xl overflow-hidden px-8 py-10 md:px-12 md:py-14 text-white shadow-xl"
        style={{ backgroundImage: 'linear-gradient(139deg, #C444FB 0%, #5B56D7 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_70%)]" />
        <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-fuchsia-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left - text */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-yellow-200 mb-4 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {__('Welcome to', 'wedevs-project-manager')}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white leading-tight">
              {__('WP Project Manager', 'wedevs-project-manager')}
            </h1>
            <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 max-w-md">
              {__('The best project management tool for WordPress to get things done with your team.', 'wedevs-project-manager')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/projects')}
                className="group bg-white text-purple-600 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold text-sm no-underline"
              >
                <Rocket className="h-5 w-5 mr-1.5 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12" />
                {__('Create Your First Project', 'wedevs-project-manager')}
              </Button>
              <Button
                variant="ghost"
                asChild
                className="group border border-white/40 text-white hover:bg-white/10 hover:text-white hover:-translate-y-0.5 transition-all font-medium text-sm"
              >
                <a
                  href="https://wedevs.com/docs/wp-project-manager/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <BookOpen className="h-5 w-5 mr-1.5 transition-transform group-hover:scale-110" />
                  {__('Read Full Guide', 'wedevs-project-manager')}
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
              {[
                __('Unlimited Projects', 'wedevs-project-manager'),
                __('Kanban & List Views', 'wedevs-project-manager'),
                __('Team Collaboration', 'wedevs-project-manager'),
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right - video thumbnail */}
          <div className="flex justify-center md:justify-end animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div
              className="relative cursor-pointer group rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 transition-transform hover:scale-[1.02]"
              onClick={() => setBannerVideoOpen(true)}
            >
              <img
                src={getAssetUrl('images/welcome/intro-video-bg-image.png')}
                alt={__('Introduction Video', 'wedevs-project-manager')}
                className="max-w-full h-auto block rounded-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <div className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 text-purple-600 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      <div>
        <SectionHeading
          kicker={__('Features', 'wedevs-project-manager')}
          title={__('Features you can use', 'wedevs-project-manager')}
          subtitle={__('Everything you need to plan, track, and ship your projects.', 'wedevs-project-manager')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.name} feature={feature} __={__} index={index} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline" className="group font-medium">
            <a
              href="https://wedevs.com/wp-project-manager-pro/features/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              {__('View All Features', 'wedevs-project-manager')}
              <ExternalLink className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* ── Resources Section ── */}
      <div className="rounded-2xl border bg-card p-8 md:p-12">
        <SectionHeading
          kicker={__('Resources', 'wedevs-project-manager')}
          title={__('Resources of Project Manager', 'wedevs-project-manager')}
          subtitle={__('Explore everything you need to get the most out of Project Manager.', 'wedevs-project-manager')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {RESOURCES.map((resource, index) => (
            <Card
              key={resource.title}
              className="group text-center border hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
              style={{ animationDelay: `${index * 90}ms`, animationFillMode: 'both' }}
            >
              <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center justify-center mb-4">
                  <resource.icon
                    className="h-10 w-10 text-pm-text-primary transition-all duration-300 group-hover:text-primary group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-pm-text-primary mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-pm-text-muted leading-relaxed mb-4">
                  {resource.description}
                </p>
                <Button asChild size="sm" variant="default" className="font-medium">
                  <a
                    href={resource.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    {resource.buttonLabel}
                    <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
