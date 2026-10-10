# Exercise 2 – Setting up Apache

## Installation und Start

Unter Linux kann Apache 2.4 typischerweise mit dem Paketmanager installiert werden, zum Beispiel:

```bash
sudo apt install apache2
sudo systemctl start apache2
```

Danach oeffnet man im Browser:

```text
http://localhost
```

Wenn Apache laeuft und die Standarddatei vorhanden ist, erscheint eine Testseite oder ein Text wie „It works“.

## Zweck von `conf/httpd.conf`

`conf/httpd.conf` ist die zentrale Konfigurationsdatei von Apache. Darin steht, auf welchem Port Apache lauscht, welche Module geladen werden, wo Dateien liegen, welche Zugriffsregeln gelten und welche virtuellen Hosts definiert sind.

## Begriffe

- `ServerRoot`: Basisverzeichnis der Apache-Installation. Relative Pfade in der Konfiguration koennen sich darauf beziehen.
- `DocumentRoot`: Verzeichnis, aus dem Apache die oeffentlich erreichbaren Webdateien ausliefert. Wenn `http://localhost/index.html` aufgerufen wird, sucht Apache diese Datei im `DocumentRoot`.
- `Virtual Host`: Eine Konfiguration fuer eine bestimmte Website oder Domain innerhalb derselben Apache-Instanz. Dadurch kann ein Server mehrere Websites mit unterschiedlichen Domains, Ports oder Verzeichnissen betreiben.

## 127.0.0.1 und localhost

`127.0.0.1` ist die Loopback-IP-Adresse. Sie zeigt immer auf den eigenen Rechner. `localhost` ist der Hostname, der normalerweise auf `127.0.0.1` aufgeloest wird. Damit kann man lokale Dienste testen, ohne dass der Rechner ueber das Netzwerk erreichbar sein muss.

## Zweck von `index.html`

`index.html` ist die Standarddatei eines Verzeichnisses. Wenn man nur `http://localhost/` oeffnet, sucht Apache im `DocumentRoot` nach einer Indexdatei und liefert sie aus. Aendert man den Inhalt dieser Datei, aendert sich die Startseite.

## Ordner `mytest`

Wenn im `DocumentRoot` ein Ordner `mytest` mit Dateien und Unterordnern angelegt wird, kann man ihn mit

```text
http://localhost/mytest
```

oeffnen. Gibt es darin eine `index.html`, wird diese Datei angezeigt. Gibt es keine Indexdatei, zeigt Apache je nach Konfiguration entweder eine Verzeichnisliste oder eine Fehlermeldung wie `403 Forbidden`. Die Verzeichnisliste erscheint nur, wenn Directory Listing aktiviert ist.
