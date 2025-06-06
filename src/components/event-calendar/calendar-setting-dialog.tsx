import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Calendar,
  Clock,
  Eye,
  Globe,
  Zap,
  CalendarDays,
  Sun,
  LucideIcon,
} from 'lucide-react';
import { useEventCalendarStore } from '@/hooks/use-event-calendar';
import { CalendarViewType, TimeFormatType, ViewModeType } from '@/types/event';
import { useShallow } from 'zustand/shallow';
import { enUS, enGB, id, es, fr, de, ja, ko } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';
import { parseAsString, useQueryState } from 'nuqs';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const LOCALES = [
  { value: 'en-US', label: 'English (US)', locale: enUS },
  { value: 'en-GB', label: 'English (UK)', locale: enGB },
  { value: 'id-ID', label: 'Bahasa Indonesia', locale: id },
  { value: 'es-ES', label: 'Español', locale: es },
  { value: 'fr-FR', label: 'Français', locale: fr },
  { value: 'de-DE', label: 'Deutsch', locale: de },
  { value: 'ja-JP', label: '日本語', locale: ja },
  { value: 'ko-KR', label: '한국어', locale: ko },
];

const VIEW_TYPES = [
  { value: 'day', label: 'Day View' },
  { value: 'days', label: 'Days View' },
  { value: 'week', label: 'Week View' },
  { value: 'month', label: 'Month View' },
  { value: 'year', label: 'Year View' },
];

const VIEW_MODES = [
  { value: 'calendar', label: 'Calendar Mode' },
  { value: 'list', label: 'List Mode' },
  { value: 'agenda', label: 'Agenda Mode' },
];

export default function CalendarSettingsDialog() {
  const {
    currentView,
    viewMode,
    timeFormat,
    locale,
    firstDayOfWeek,
    viewSettings,
    setView,
    setMode,
    setTimeFormat,
    setLocale,
    setFirstDayOfWeek,
    updateDayViewConfig,
    updateWeekViewConfig,
    updateMonthViewConfig,
    updateYearViewConfig,
  } = useEventCalendarStore(
    useShallow((state) => ({
      currentView: state.currentView,
      viewMode: state.viewMode,
      timeFormat: state.timeFormat,
      locale: state.locale,
      firstDayOfWeek: state.firstDayOfWeek,
      daysCount: state.daysCount,
      viewSettings: state.viewSettings,
      setView: state.setView,
      setMode: state.setMode,
      setTimeFormat: state.setTimeFormat,
      setLocale: state.setLocale,
      setFirstDayOfWeek: state.setFirstDayOfWeek,
      setDaysCount: state.setDaysCount,
      updateDayViewConfig: state.updateDayViewConfig,
      updateWeekViewConfig: state.updateWeekViewConfig,
      updateMonthViewConfig: state.updateMonthViewConfig,
      updateYearViewConfig: state.updateYearViewConfig,
    })),
  );

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [, startTransition] = useTransition();
  const [, setQueryView] = useQueryState(
    'view',
    parseAsString.withOptions({
      shallow: false,
      throttleMs: 3,
      startTransition,
    }),
  );

  const handleSave = () => {
    console.log('Saving settings');
    setOpen(false);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'calendar', label: 'Calendar Views', icon: Calendar },
    { id: 'integration', label: 'Integration', icon: Zap },
  ];

  const ConfigRow = ({
    label,
    description,
    children,
  }: {
    label: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0 flex-1 pr-4">
        <div className="text-foreground text-sm font-medium">{label}</div>
        {description && (
          <div className="text-muted-foreground mt-1 text-xs">
            {description}
          </div>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  const ConfigSection = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4">
      <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );

  const renderGeneralSettings = () => {
    const currentLocaleCode =
      LOCALES.find((l) => l.locale.code === locale.code)?.value || 'en-US';

    return (
      <div className="space-y-8">
        <ConfigSection title="Display & Format" icon={Eye}>
          <ConfigRow
            label="Default view"
            description="Choose which view opens by default"
          >
            <Select
              value={currentView}
              onValueChange={(value: CalendarViewType) => {
                setQueryView(value);
                setView(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEW_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="View mode"
            description="Default display mode for calendar"
          >
            <Select
              value={viewMode}
              onValueChange={(value: ViewModeType) => setMode(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEW_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Time format"
            description="Choose between 12-hour or 24-hour format"
          >
            <Select
              value={timeFormat}
              onValueChange={(value: TimeFormatType) => setTimeFormat(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </ConfigRow>
        </ConfigSection>

        <Separator />

        <ConfigSection title="Regional Settings" icon={Globe}>
          <ConfigRow
            label="Language & Region"
            description="Set your preferred language and locale"
          >
            <Select
              value={currentLocaleCode}
              onValueChange={(value) => {
                const selectedLocale = LOCALES.find((l) => l.value === value);
                if (selectedLocale) {
                  setLocale(selectedLocale.locale);
                }
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Start week on"
            description="Choose the first day of the week"
          >
            <Select
              value={firstDayOfWeek.toString()}
              onValueChange={(value) =>
                setFirstDayOfWeek(parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>
        </ConfigSection>
      </div>
    );
  };

  const renderCalendarSettings = () => (
    <div className="space-y-8">
      <ConfigSection title="Time-based Views" icon={Clock}>
        <ConfigRow
          label="Current time indicator"
          description="Show red line at current time in day/week views"
        >
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={viewSettings.day.showCurrentTimeIndicator}
                onCheckedChange={(checked) =>
                  updateDayViewConfig({ showCurrentTimeIndicator: checked })
                }
              />
              <span className="text-muted-foreground text-xs">Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={viewSettings.week.showCurrentTimeIndicator}
                onCheckedChange={(checked) =>
                  updateWeekViewConfig({ showCurrentTimeIndicator: checked })
                }
              />
              <span className="text-muted-foreground text-xs">Week</span>
            </div>
          </div>
        </ConfigRow>

        <ConfigRow
          label="Hover time indicator"
          description="Show time when hovering over time slots"
        >
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={viewSettings.day.showHoverTimeIndicator}
                onCheckedChange={(checked) =>
                  updateDayViewConfig({ showHoverTimeIndicator: checked })
                }
              />
              <span className="text-muted-foreground text-xs">Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={viewSettings.week.showHoverTimeIndicator}
                onCheckedChange={(checked) =>
                  updateWeekViewConfig({ showHoverTimeIndicator: checked })
                }
              />
              <span className="text-muted-foreground text-xs">Week</span>
            </div>
          </div>
        </ConfigRow>

        <ConfigRow
          label="Click to create events"
          description="Allow clicking time slots to create new events"
        >
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={viewSettings.day.enableTimeSlotClick}
                onCheckedChange={(checked) =>
                  updateDayViewConfig({ enableTimeSlotClick: checked })
                }
              />
              <span className="text-muted-foreground text-xs">Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={viewSettings.week.enableTimeSlotClick}
                onCheckedChange={(checked) =>
                  updateWeekViewConfig({ enableTimeSlotClick: checked })
                }
              />
              <span className="text-muted-foreground text-xs">Week</span>
            </div>
          </div>
        </ConfigRow>

        <ConfigRow
          label="Expand multi-day events"
          description="Show multi-day events across multiple columns in week view"
        >
          <Switch
            checked={viewSettings.week.expandMultiDayEvents}
            onCheckedChange={(checked) =>
              updateWeekViewConfig({ expandMultiDayEvents: checked })
            }
          />
        </ConfigRow>
      </ConfigSection>

      <Separator />

      <ConfigSection title="Month View" icon={CalendarDays}>
        <ConfigRow
          label="Events per day limit"
          description="Maximum events shown before +more indicator"
        >
          <Input
            type="number"
            value={viewSettings.month.eventLimit}
            onChange={(e) =>
              updateMonthViewConfig({ eventLimit: parseInt(e.target.value) })
            }
            className="w-20 text-center"
            min={1}
            max={10}
          />
        </ConfigRow>

        <ConfigRow
          label="Show more events indicator"
          description="Display +X more when events exceed limit"
        >
          <Switch
            checked={viewSettings.month.showMoreEventsIndicator}
            onCheckedChange={(checked) =>
              updateMonthViewConfig({ showMoreEventsIndicator: checked })
            }
          />
        </ConfigRow>

        <ConfigRow
          label="Hide outside days"
          description="Hide days from previous/next month"
        >
          <Switch
            checked={viewSettings.month.hideOutsideDays}
            onCheckedChange={(checked) =>
              updateMonthViewConfig({ hideOutsideDays: checked })
            }
          />
        </ConfigRow>
      </ConfigSection>

      <Separator />

      <ConfigSection title="Year View" icon={Sun}>
        <ConfigRow
          label="Show month labels"
          description="Display month names in year view"
        >
          <Switch
            checked={viewSettings.year.showMonthLabels}
            onCheckedChange={(checked) =>
              updateYearViewConfig({ showMonthLabels: checked })
            }
          />
        </ConfigRow>

        <ConfigRow
          label="Quarter view mode"
          description="Group months by quarters instead of 12-month grid"
        >
          <Switch
            checked={viewSettings.year.quarterView}
            onCheckedChange={(checked) =>
              updateYearViewConfig({ quarterView: checked })
            }
          />
        </ConfigRow>

        <ConfigRow
          label="Highlight current month"
          description="Emphasize the current month in year view"
        >
          <Switch
            checked={viewSettings.year.highlightCurrentMonth}
            onCheckedChange={(checked) =>
              updateYearViewConfig({ highlightCurrentMonth: checked })
            }
          />
        </ConfigRow>
      </ConfigSection>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-8">
      <ConfigSection title="External Integrations" icon={Zap}>
        <div className="text-muted-foreground bg-muted/30 rounded-lg p-4 text-sm">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
          <p>
            Integration settings for Google Calendar, Outlook, and other
            calendar services will be available here.
          </p>
        </div>

        <ConfigRow
          label="Google Calendar Sync"
          description="Sync events with your Google Calendar"
        >
          <Badge variant="secondary">Coming Soon</Badge>
        </ConfigRow>

        <ConfigRow
          label="Outlook Integration"
          description="Connect with Microsoft Outlook calendar"
        >
          <Badge variant="secondary">Coming Soon</Badge>
        </ConfigRow>

        <ConfigRow
          label="CalDAV Support"
          description="Connect to CalDAV compatible calendar servers"
        >
          <Badge variant="secondary">Coming Soon</Badge>
        </ConfigRow>
      </ConfigSection>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'calendar':
        return renderCalendarSettings();
      case 'integration':
        return renderIntegrationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Calendar Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex h-full">
          <div className="bg-muted/20 w-56 border-r p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={`text-sm`}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Calendar Settings
              </DialogTitle>
              <DialogDescription>
                Customize your calendar experience and behavior
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <ScrollArea className="h-[400px] w-full pr-4">
                {renderContent()}
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-2 border-t p-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
