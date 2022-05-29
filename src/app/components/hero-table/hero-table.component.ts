import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { DEFAULT_PAGE, Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent {
    //view model
    vm$ = combineLatest([
        this.hero.heroes$,
        this.hero.searchBS,
        this.hero.userPage$,
        this.hero.limitBS,
        this.hero.totalResults$,
        this.hero.totalPages$,
    ]).pipe(
        map(([heroes, search, page, limit, totalResults, totalPages]) => {
            return {
                heroes,
                search,
                page,
                limit,
                totalResults,
                totalPages,
                disableNext: totalPages === page,
                disablePrevious: page === 1,
            };
        }),
    );

    constructor(public hero: HeroService) {}

    doSearch(event: any) {
        this.hero.searchBS.next(event.target.value);
        this.hero.pageBS.next(DEFAULT_PAGE);
    }

    movePage(moveBy: number) {
        const currentPage = this.hero.pageBS.getValue(); //syncronous
        this.hero.pageBS.next(currentPage + moveBy);
    }

    setLimit(limit: number) {
        this.hero.limitBS.next(limit);
        this.hero.pageBS.next(DEFAULT_PAGE);
    }
}
