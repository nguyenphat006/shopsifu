import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { JSX } from 'react';

// Khai báo kiểu dữ liệu cho props
interface RecentActivitiesProps {
  activities: { text: string; icon: JSX.Element; date: string }[];
}

export function RecentActivitiesList({ activities }: RecentActivitiesProps) {
  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-gray-100 text-red-500">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.text}</p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">Chưa có hoạt động nào gần đây.</p>
      )}
    </div>
  );
}