/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import Menu from "@/components/Menu";
import ClassComponent from "@/components/ClassComponent";
import RootComponent from "@/components/RootComponent";
import TeachersComponent from "@/components/TeachersComponent";
import StudentsComponent from "@/components/StudentsComponent";
import InformationComponent from "@/components/InformationComponent";
import UploadComponent from "@/components/UploadComponent";
import ResultComponent from "@/components/ResultComponent";
import DetectComponent from "@/components/DetectComponent";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "RootComponent",
      component: RootComponent,
    },
    {
      path: "/teachers",
      name: "Teachers",
      component: TeachersComponent,
      children: [
        {
          path: "/menu",
          name: "Menu",
          component: Menu,
        },
        {
          path: "/class",
          name: "Class",
          component: ClassComponent,
        },
        {
          path: "/information",
          name: "Information",
          component: InformationComponent,
        },
        {
          path: "/upload",
          name: "Upload",
          component: UploadComponent,
        },
      ]
    },
    {
      path: "/students",
      name: "Students",
      component: StudentsComponent,
    },
    {
      path: "/result",
      name: "Result",
      component: ResultComponent,
    },
    {
      path: "/detect",
      name: "Detect",
      component: DetectComponent,
      props:true,
    },
  ],
  linkActiveClass: "is-active", // active class for non-exact links.
  linkExactActiveClass: "is-active" // active class for *exact* links.
});
