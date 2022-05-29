import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DEFAULT_PAGE, Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent {
    showSpinner = false;

    //view model
    vm$ = combineLatest([
        this.hero.heroes$.pipe(tap(() => (this.showSpinner = false))),
        this.hero.search$,
        this.hero.userPage$,
        this.hero.limit$,
        this.hero.totalResults$,
        this.hero.totalPages$,
        this.hero.loading$,
    ]).pipe(
        map(
            ([
                heroes,
                search,
                page,
                limit,
                totalResults,
                totalPages,
                loading,
            ]) => {
                return {
                    heroes,
                    search,
                    page,
                    limit,
                    totalResults,
                    totalPages,
                    loading,
                    disableNext: totalPages === page,
                    disablePrevious: page === 1,
                };
            },
        ),
    );

    constructor(public hero: HeroService) {}

    doSearch(event: any) {
        this.showSpinner = true;
        this.hero.doSearch(event.target.value);
    }

    movePage(moveBy: number) {
        this.showSpinner = true;
        this.hero.movePageBy(moveBy);
    }

    setLimit(limit: number) {
        this.showSpinner = true;
        this.hero.setLimit(limit);
    }
}
