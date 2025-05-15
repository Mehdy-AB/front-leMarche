export default function NotificationsSettingsFr() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Notifications</h2>
      <p className="text-sm text-muted-foreground">Choisissez comment vous souhaitez être notifié.</p>
      <div className="space-y-4">
        {[
          { title: "Notifications par email", enabled: true },
        ].map((notif, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <p>{notif.title}</p>
            <input type="checkbox" defaultChecked={notif.enabled} />
          </div>
        ))}
      </div>
    </div>
  );
}
