import * as ko from "knockout";
import * as Survey from "survey-knockout";
import { SurveyPropertyItemsEditor } from "./propertyItemsEditor";
import {
  SurveyPropertyEditorBase,
  ISurveyObjectEditorOptions
} from "./propertyEditorBase";
import { SurveyHelper } from "../surveyHelper";
import { editorLocalization } from "../editorLocalization";
import { SurveyQuestionEditor } from "../questionEditors/questionEditor";
import {
  SurveyNestedPropertyEditor,
  SurveyNestedPropertyEditorItem,
  SurveyNestedPropertyEditorColumn
} from "./propertyNestedPropertyEditor";
import { SurveyPropertyEditorFactory } from "./propertyEditorFactory";

export class SurveyPropertyTextItemsEditor extends SurveyNestedPropertyEditor {
  constructor(property: Survey.JsonObjectProperty) {
    super(property);
  }
  public get editorType(): string {
    return "textitems";
  }
  protected getEditorName(): string {
    if (!this.koEditItem()) return "";
    return editorLocalization
      .getString("pe.columnEdit")
      ["format"](this.koEditItem().koName());
  }
  protected createNewEditorItem(): any {
    var newItem = new Survey.MultipleTextItem(this.getNewName());
    newItem["object"] = this.object;
    //newColumn.colOwner = TODO set colOwner.
    return new SurveyPropertyTextItemsItem(newItem, this.columns, this.options);
  }
  protected createEditorItem(item: any) {
    return new SurveyPropertyTextItemsItem(item, this.columns, this.options);
  }
  protected createItemFromEditorItem(editorItem: any) {
    return editorItem.item;
  }
  protected getProperties(): Array<Survey.JsonObjectProperty> {
    var names = this.getPropertiesNames("multipletext@items", [
      "isRequired",
      "name",
      "title"
    ]);
    return this.getPropertiesByNames("multipletextitem", names);
  }
  private getNewName(): string {
    var objs = [];
    var items = this.koItems();
    for (var i = 0; i < items.length; i++) {
      var item = items[i].item;
      if (!!item) {
        objs.push({ name: item.name });
      }
    }
    return SurveyHelper.getNewName(objs, "text");
  }
}

export class SurveyPropertyTextItemsItem extends SurveyNestedPropertyEditorItem {
  constructor(
    public item: Survey.MultipleTextItem,
    public columns: Array<SurveyNestedPropertyEditorColumn>,
    options: ISurveyObjectEditorOptions
  ) {
    super(item, columns, options);
  }
  protected createSurveyQuestionEditor() {
    return new SurveyQuestionEditor(
      this.item,
      null,
      "multipletextitem",
      this.options
    );
  }
}

SurveyPropertyEditorFactory.registerEditor("textitems", function(
  property: Survey.JsonObjectProperty
): SurveyPropertyEditorBase {
  return new SurveyPropertyTextItemsEditor(property);
});
