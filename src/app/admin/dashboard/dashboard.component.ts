import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HeaderService} from "../../shared/header.service";
import {RedirectService} from "../../shared/redirect.service";

@Component({
  selector: 'admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit{

  constructor(private headerService: HeaderService, private redirect: RedirectService) {
    this.headerService.init('Admin Dashboard', false, false)
  }

  /*
  -- Seiten --
  Seller/Buyer Anfragen
  Items
   - pro Modus
   - Noch nicht eingestellte Items
   - Alle Items
  Kategorien

  -- Item Einstellungen --
  Kategorien
  Name (+Übersetzung)       !(min Deutsch)
  Beschreibung (+Übersetzung)
  Preis Anpassung
  Image Url auswählen       !
  Item Url auswählen        !
  Animationen auswählen

  -- Item bereits gegeben --
  Preis
  (Anzeige Namen) muss noch eingefügt werden in Mod
  item id von mod

  -- Kategorie Einstellungen --
  Name (+Übersetzung)       !(min Deutsch)
  route                     !
  inNavigation

  -- Animation Auswahl --
  Animation auswählen
  AnimationDaten auswählen

   */
  activeId: any;

  ngOnInit(): void {
    this.redirect.resetQueryParams();
  }

}
