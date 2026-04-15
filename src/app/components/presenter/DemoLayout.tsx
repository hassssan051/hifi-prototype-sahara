import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import PhoneFrame from "./PhoneFrame";
import ProxyDevicePlaceholder from "../sahara/ProxyDevicePlaceholder";
import ElderFullAppPrototype from "../sahara/ElderFullAppPrototype";
import ProxyFullAppPrototype from "../sahara/ProxyFullAppPrototype";
import ElderFlowPrototype, {
  type FlowPrototypeKey,
} from "../sahara/ElderFlowPrototype";

export type DeviceKey = "elder" | "proxy";
export type DemoTypeKey = "app" | "scenario-flow";

const FLOW_PROTOTYPES: Array<{
  id: FlowPrototypeKey;
  label: string;
  description: string;
  instructions: string[];
}> = [
  {
    id: "sms-alert-flow",
    label: "SMS Scam Alert",
    description:
      "Elder receives scam SMS, Sahara highlights risk and provides guidance with proxy notification option.",
    instructions: [
      "A scam message will appear on screen",
      "Sahara automatically detects it and turns red with caution",
      "Click the Sahara button to learn more about the alert or dismiss it",
      "Clicking 'Learn more' will explain the scam further to the user",
    ],
  },
  {
    id: "irreversible-action-flow",
    label: "Irreversible Action",
    description:
      "Factory reset-style destructive action interception with warning and teach/do escalation behavior.",
    instructions: [
      "An on-screen button triggers an irreversible action",
      "If clicked, Sahara intervenes in the middle and warns you",
      "You can choose to still continue or cancel the action",
    ],
  },
  {
    id: "walkthrough-flow",
    label: "Secondary WhatsApp Walkthrough",
    description:
      "Step-by-step assistive walkthrough for sending a photo inside WhatsApp using contextual prompts.",
    instructions: [
      "You arrive at a screen you've learned before (sending a gallery image)",
      "Sahara automatically detects this and starts pinging blue",
      "Click on the Sahara button and opt to start the walkthrough",
      "Follow the on-screen instructions to upload an image",
    ],
  },
  {
    id: "wifi-fix-flow",
    label: "Wi-Fi Fix Walkthrough",
    description:
      "Step-by-step guidance flow to recover internet connectivity by navigating settings safely.",
    instructions: [
      "Wi-Fi was accidentally turned off and there is no internet connection",
      "Click on the Sahara assistant to open the chat",
      "Use the prompt suggestion 'Fix error' showing up",
      "Follow the walkthrough to turn the internet back on again",
    ],
  },
];

type DemoLayoutProps = {
  activeDemoType: DemoTypeKey;
  activeDevice: DeviceKey;
  activeFlowPrototype: FlowPrototypeKey;
  onDemoTypeChange: (demoType: DemoTypeKey) => void;
  onDeviceChange: (device: DeviceKey) => void;
  onFlowPrototypeChange: (flow: FlowPrototypeKey) => void;
  onResetPresenter: () => void;
};

export default function DemoLayout({
  activeDemoType,
  activeDevice,
  activeFlowPrototype,
  onDemoTypeChange,
  onDeviceChange,
  onFlowPrototypeChange,
  onResetPresenter,
}: DemoLayoutProps) {
  const activeFlow = FLOW_PROTOTYPES.find(
    (item) => item.id === activeFlowPrototype,
  );

  const activeTitle =
    activeDemoType === "app"
      ? activeDevice === "elder"
        ? "Elder App Prototype"
        : "Proxy App Prototype"
      : activeDevice === "elder"
        ? activeFlow?.label
        : "Proxy Scenario Flows";

  const activeDescription =
    activeDemoType === "app"
      ? activeDevice === "elder"
        ? "Full elder experience including pairing, home controls, and assistive overlay behavior."
        : "Full proxy experience including onboarding, dashboard, alerts, details, and settings."
      : activeDevice === "elder"
        ? activeFlow?.description
        : "Scenario flows are currently modeled for Elder only.";

  return (
    <div className="p-4 min-h-screen md:p-6">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4  lg:grid-cols-3">
        <Card className="flex min-h-[420px] flex-col border-slate-300/80 bg-white/95 shadow-lg lg:col-span-1">
          <CardHeader className="border-b flex flex-row items-start justify-between gap-4 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">Sahara Prototype</CardTitle>
              <CardDescription>
                Pick a device, choose the view mode, and present it in one phone
                simulator.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 h-8 shrink-0 border-slate-300 bg-white text-slate-700 shadow-sm"
              onClick={onResetPresenter}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Restart Simulation
            </Button>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4 pt-6">
            <Tabs
              value={activeDevice}
              onValueChange={(val) => {
                onDeviceChange(val as DeviceKey);
                onDemoTypeChange("app");
              }}
              className="flex w-full flex-col"
            >
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Select Experience
                </p>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="elder">Elder Experience</TabsTrigger>
                  <TabsTrigger value="proxy">Proxy Experience</TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-6 flex-1">
                <TabsContent
                  value="elder"
                  className="m-0 flex flex-col gap-6 data-[state=inactive]:hidden"
                >
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={activeDemoType === "app" ? "default" : "outline"}
                      className="w-full justify-start font-medium shadow-sm transition-all h-12"
                      onClick={() => onDemoTypeChange("app")}
                    >
                      <div className="flex items-center w-full justify-between">
                        <span>Full Application Prototype</span>
                        {activeDemoType === "app" && (
                          <CheckCircle2 className="w-4 h-4 text-white/80" />
                        )}
                      </div>
                    </Button>

                    <div className="mt-4 flex flex-col gap-3 relative">
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Scenario Flows
                        </span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {FLOW_PROTOTYPES.map((item) => {
                          const isActive =
                            activeDemoType === "scenario-flow" &&
                            activeFlowPrototype === item.id;
                          return (
                            <div
                              key={item.id}
                              className={`flex flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
                                isActive
                                  ? "border-[#00695C] bg-[#00695C]/5 shadow-md ring-1 ring-[#00695C]/20"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                              }`}
                            >
                              <button
                                type="button"
                                className="flex w-full cursor-pointer flex-col items-start gap-1 p-4 text-left group"
                                onClick={() => {
                                  onDemoTypeChange("scenario-flow");
                                  onFlowPrototypeChange(item.id);
                                }}
                              >
                                <div className="flex w-full items-center justify-between">
                                  <span
                                    className={`font-bold ${isActive ? "text-[#00695C]" : "text-slate-800"}`}
                                  >
                                    {item.label}
                                  </span>
                                  {isActive ? (
                                    <div className="flex items-center justify-center rounded-full bg-[#00695C]/10 px-2 py-0.5 text-xs font-semibold text-[#00695C]">
                                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                      Active
                                    </div>
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-300 transition-transform group-hover:text-slate-500 group-hover:translate-x-0.5" />
                                  )}
                                </div>
                                <span
                                  className={`mt-1 text-[12px] leading-relaxed ${isActive ? "text-slate-700" : "text-slate-500"}`}
                                >
                                  {item.description}
                                </span>
                              </button>

                              {isActive && (
                                <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-[#00695C]/10 bg-white px-4 py-3 pb-4">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00695C] mb-2 block">
                                    Simulation Instructions
                                  </span>
                                  <ul className="flex flex-col gap-2">
                                    {item.instructions.map((inst, i) => (
                                      <li
                                        key={i}
                                        className="text-[12px] text-slate-600 flex items-start gap-2"
                                      >
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00695C]/10 text-[9px] font-bold text-[#00695C] mt-0.5">
                                          {i + 1}
                                        </span>
                                        <span className="leading-tight pt-[1px]">
                                          {inst}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="proxy"
                  className="m-0 flex flex-col gap-6 data-[state=inactive]:hidden"
                >
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={activeDemoType === "app" ? "default" : "outline"}
                      className="w-full justify-start font-medium shadow-sm transition-all"
                      onClick={() => onDemoTypeChange("app")}
                    >
                      Full Application Prototype
                    </Button>
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
                      <p className="text-xs text-slate-500">
                        Contextual flows are currently only available for the
                        Elder Experience.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 p-4 md:p-8 lg:col-span-2">
          <PhoneFrame>
            {activeDemoType === "app" ? (
              activeDevice === "elder" ? (
                <ElderFullAppPrototype />
              ) : (
                <ProxyFullAppPrototype />
              )
            ) : activeDevice === "elder" ? (
              <ElderFlowPrototype activeFlow={activeFlowPrototype} />
            ) : (
              <ProxyDevicePlaceholder
                title="Proxy Scenario Flows"
                description="Scenario flows are currently modeled for the Elder experience."
              />
            )}
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
