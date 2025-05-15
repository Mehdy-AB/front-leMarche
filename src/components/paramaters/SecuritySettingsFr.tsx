export default function SecuritySettingsFr() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Sécurité</h2>
      <p className="text-sm text-muted-foreground">
        Gérez vos paramètres de sécurité et de connexion.
      </p>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Mot de passe</p>
            <p className="text-muted-foreground text-sm">••••••••••</p>
          </div>
          <button className="text-blue-600 text-sm font-medium">Modifier</button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Authentification à deux facteurs</p>
            <p className="text-muted-foreground text-sm">Désactivé</p>
          </div>
          <button className="text-blue-600 text-sm font-medium">Activer</button>
        </div>
      </div>
    </div>
  );
}
