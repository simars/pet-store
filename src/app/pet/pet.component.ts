import {Component, OnInit, ViewChild} from '@angular/core';
import {PetService} from '../providers/pet.service';
import {Router} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Pet} from '../model/pet-domain.model';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})
export class PetComponent implements OnInit {

  private list: Pet[];

  dataSource: MatTableDataSource<Pet>;

  displayedColumns = ['id', 'name', 'status', 'category', 'action'];


  constructor(private petService: PetService, private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  details(element: Pet) {
    this.router.navigate(['/pet', element.id]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  remove(element: Pet, table) {
    this.petService.removePet(element.id)
      .subscribe(
        {
         next: () => {
           this.list.splice(this.list.indexOf(element), 1);
           // table.renderRows(); // prefer behaviour subject on datasource
           this.dataSource.connect().next(this.list);
         }
        }
      );
  }

  manage(element: Pet) {
    this.router.navigate(['/pet/manage', element.id]);
  }


  ngOnInit() {
    this.petService.getPets()
      .subscribe(
      {
        next: list => {
          this.list = list;
          this.dataSource = new MatTableDataSource(list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    );
  }

}

