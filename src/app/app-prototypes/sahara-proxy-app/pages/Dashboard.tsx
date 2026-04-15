import React from "react";
import {
  ShieldCheck,
  Wifi,
  Activity,
  MessageCircleHeart,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { flowSaharaLogo } from "../../../components/sahara/flows/flowLogo";

export const Dashboard = () => {
  const activities = [
    {
      id: 1,
      type: "success",
      time: "10:00 AM Today",
      title: "Guided Photo Sharing",
      desc: "Successfully guided Aba through sending a WhatsApp photo to Family Group.",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      id: 2,
      type: "warning",
      time: "Yesterday, 4:30 PM",
      title: "Blocked Malicious Link",
      desc: "Blocked interaction with a malicious BISP link received via SMS.",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      id: 3,
      type: "info",
      time: "Tuesday, 11:15 AM",
      title: "System Update Deferred",
      desc: "Paused an intrusive OS update popup while Aba was reading news.",
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-50 px-5 pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Command Center
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">
            Monitoring Aba's device
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-200 overflow-hidden flex items-center justify-center p-1">
          <img
            src={flowSaharaLogo}
            alt="Sahara"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Connection Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00695C]/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shadow-inner">
                <Wifi className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">Device Online</h2>
              <p className="text-[13px] text-green-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Overlay Active
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Last sync: Just now
          </div>
          <div className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md">
            Battery: 84%
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider mb-3 px-1">
          Quick Actions
        </h3>
        <button className="w-full bg-[#00695C] text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-[#00695C]/20 hover:bg-[#004d40] active:scale-[0.98] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircleHeart className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base">Quick Ping</div>
              <div className="text-xs text-white/80 font-medium">
                Send "Just checking in" to widget
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#00695C]" />
            Activity Log
          </h3>
          <button className="text-xs font-bold text-[#00695C]">View All</button>
        </div>

        <div className="relative pl-3 pb-8">
          {/* Timeline Line */}
          <div className="absolute left-[1.1rem] top-4 bottom-0 w-px bg-neutral-200"></div>

          <div className="space-y-6">
            {activities.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-neutral-50 flex items-center justify-center -translate-x-1/2 ${item.bg}`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${item.color.replace("text-", "bg-")}`}
                    ></div>
                  </div>

                  {/* Card */}
                  <div
                    className={`bg-white rounded-2xl p-4 shadow-sm border ${item.border} hover:shadow-md transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${item.bg} ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-[14px] text-neutral-900">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-medium text-neutral-400">
                            {item.time.split(",")[0]}
                          </span>
                        </div>
                        <p className="text-[13px] text-neutral-500 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
