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
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    title: __('Pro Features', 'wedevs-project-manager'),
    description: __('Enhance your project management performance with extended features in the pro version.', 'wedevs-project-manager'),
    buttonLabel: __('View Pro Features', 'wedevs-project-manager'),
    buttonUrl: 'https://wedevs.com/wp-project-manager-pro/extensions/',
    icon: Sparkles,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    title: __('Module', 'wedevs-project-manager'),
    description: __('Check out all the useful modules that would take your project management experience to a whole new level.', 'wedevs-project-manager'),
    buttonLabel: __('Go to Modules', 'wedevs-project-manager'),
    buttonUrl: 'https://wedevs.com/wp-project-manager-pro/extensions/',
    icon: Package,
    gradient: 'from-violet-400 to-blue-500',
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

function FeatureCard({ feature, __ }) {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      <VideoModal
        open={videoOpen}
        onOpenChange={setVideoOpen}
        videoId={feature.video}
      />
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div
          className="relative cursor-pointer"
          onClick={() => setVideoOpen(true)}
          style={{ background: feature.bg }}
        >
          <img
            src={getAssetUrl('images/welcome/' + feature.thumb)}
            alt={feature.name}
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <CardContent className="p-5 text-center">
          <div
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl mb-3 mx-auto"
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

export default function WelcomePage() {
  const navigate = useNavigate()
  const [bannerVideoOpen, setBannerVideoOpen] = useState(false)
  const FEATURES = useMemo(() => getFeatures(), [])
  const RESOURCES = useMemo(() => getResources(), [])

  return (
    <div className="max-w-[960px] mx-auto p-4 sm:p-6 space-y-12">
      {/* ── Hero Banner ── */}
      <VideoModal
        open={bannerVideoOpen}
        onOpenChange={setBannerVideoOpen}
        videoId="rliDPp4sIyM"
      />

      <div className="relative rounded-2xl overflow-hidden px-8 py-10 md:px-12 md:py-14 text-white"
        style={{ backgroundImage: 'linear-gradient(139deg, #C444FB 0%, #5B56D7 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left - text */}
          <div>
            <p className="text-sm text-yellow-300 mb-1 font-medium">
              {__('Welcome to', 'wedevs-project-manager')}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {__('WP Project Manager', 'wedevs-project-manager')}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {__('The best project management tool for WordPress to get things done with your team.', 'wedevs-project-manager')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/projects')}
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-sm no-underline"
              >
                <Rocket className="h-5 w-5 mr-1.5" />
                {__('Create Your First Project', 'wedevs-project-manager')}
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white/40 text-white hover:bg-white/10 font-medium text-sm"
              >
                <a
                  href="https://wedevs.com/docs/wp-project-manager/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <BookOpen className="h-5 w-5 mr-1.5" />
                  {__('Read Full Guide', 'wedevs-project-manager')}
                </a>
              </Button>
            </div>
          </div>

          {/* Right - video thumbnail */}
          <div className="flex justify-center md:justify-end">
            <div
              className="relative cursor-pointer group rounded-lg overflow-hidden shadow-2xl"
              onClick={() => setBannerVideoOpen(true)}
            >
              <img
                src={getAssetUrl('images/welcome/intro-video-bg-image.png')}
                alt={__('Introduction Video', 'wedevs-project-manager')}
                className="max-w-full h-auto block rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse">
                  <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      <div>
        <h2 className="text-xl font-bold text-pm-text-primary text-center mb-8">
          {__('Features you can use...', 'wedevs-project-manager')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.name} feature={feature} __={__} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Button asChild variant="default" className="font-medium">
            <a
              href="https://wedevs.com/wp-project-manager-pro/features/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              {__('View All Features', 'wedevs-project-manager')}
              <ExternalLink className="h-4 w-4 ml-1.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* ── Resources Section ── */}
      <div className="rounded-2xl border bg-card p-8 md:p-12">
        <h2 className="text-xl font-bold text-pm-text-primary text-center mb-10">
          {__('Resources of Project Manager', 'wedevs-project-manager')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESOURCES.map((resource) => (
            <Card
              key={resource.title}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 flex flex-col items-center">
                <div
                  className={`h-16 w-16 rounded-full bg-gradient-to-br ${resource.gradient} flex items-center justify-center shadow-md mb-4`}
                >
                  <resource.icon className="h-7 w-7 text-white" />
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
                    <ArrowRight className="h-4 w-4 ml-1.5" />
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
