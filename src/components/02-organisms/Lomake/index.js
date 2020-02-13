import React, { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { forEach, prop, split } from "ramda";
import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { useLomakkeet } from "../../../stores/lomakkeet";

function markRequiredFields(lomake, changeObjects = [], rules = []) {
  let modifiedLomake = cloneDeep(lomake);
  forEach(rule => {
    const isRequired = rule.isRequired(modifiedLomake, changeObjects);
    modifiedLomake = rule.markRequiredFields(modifiedLomake, isRequired);
    const isValid = rule.isValid(modifiedLomake, changeObjects, isRequired)();
    modifiedLomake = rule.showErrors(modifiedLomake, isValid);
  }, rules);
  return modifiedLomake;
}

const defaultProps = {
  changeObjects: []
};

const Lomake = React.memo(
  ({
    action,
    anchor,
    changeObjects = defaultProps.changeObjects,
    data,
    metadata,
    isReadOnly,
    onChangesUpdate,
    path,
    prefix = "",
    rules = [],
    rulesFn,
    showCategoryTitles = true
  }) => {
    const intl = useIntl();
    const [, lomakkeetActions] = useLomakkeet();

    const lomake = useMemo(() => {
      let categories = getLomake(
        action,
        data,
        isReadOnly,
        intl.locale,
        path,
        prefix
      );
      let _rules = cloneDeep(rules);
      if (rulesFn) {
        _rules = rulesFn(categories);
      }
      if (_rules.length) {
        categories = markRequiredFields(categories, changeObjects, _rules);
      }
      return {
        categories,
        metadata
      };
    }, [
      action,
      changeObjects,
      data,
      intl.locale,
      isReadOnly,
      metadata,
      path,
      prefix,
      rules,
      rulesFn
    ]);

    useEffect(() => {
      lomakkeetActions.set(split("_", anchor), lomake);
    }, [anchor, lomake, lomakkeetActions]);

    if (prop("categories", lomake) && onChangesUpdate) {
      return (
        <div className="p-8">
          <CategorizedListRoot
            anchor={anchor}
            categories={lomake.categories}
            changes={changeObjects}
            onUpdate={onChangesUpdate}
            showCategoryTitles={showCategoryTitles}
          />
        </div>
      );
    } else {
      return <div>Nothing to show.</div>;
    }
  }
);

Lomake.propTypes = {
  anchor: PropTypes.string,
  changeObjects: PropTypes.array,
  data: PropTypes.object,
  metadata: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  path: PropTypes.array,
  // Is used for matching the anchor of reasoning field to the anchor of
  // original change object.
  prefix: PropTypes.string,
  rules: PropTypes.array,
  // This is useful for dynamic forms.
  rulesFn: PropTypes.func
};

export default Lomake;
