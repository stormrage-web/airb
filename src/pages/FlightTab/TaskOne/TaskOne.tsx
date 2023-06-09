import React, { useEffect } from "react";
import styles from "./TaskOne.module.scss";
import CustomDatepicker from "../../../widgets/CustomDatepicker/CustomDatepicker";
import { CustomSelect } from "../../../widgets/CustomSelect/CustomSelect";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Option } from "../../../widgets/CustomSelect/CustomOption/CustomOption";
import ToggleSwitch from "../../../widgets/ToggleSwitch/ToggleSwitch";
import { useTaskOneLogic } from "./TaskOne.logic";
import Skeleton from "react-loading-skeleton";

interface TaskOneProps {
  flight: string;
  classes: Option[];
}

const TaskOne = ({ flight, classes }: TaskOneProps) => {
    const {
      fetchFlightHandler,
      handleTypeChange,
      handleChangeDate,
      handleChangeClass,
      isSeasonTypeActive,
      tabParams,
      tabInfo,
      formatDate
    } = useTaskOneLogic({ flight });

    useEffect(() => {
      fetchFlightHandler({
        tab: 1,
        data: {
          flight: flight,
          tabParams: {
            date: "01.02.2018",
            class: classes.length ? classes[0].title : "",
            type: 0
          }
        }
      });
    }, []);


    return (
      <>
        <div className={styles.filters}>
          <div>
            <p className={styles.filters__selectTitle}>
              Дата бронирования
            </p>
            <CustomDatepicker
              date={
                new Date(formatDate(tabParams.date || "04.03.2019"))
              }
              setDate={handleChangeDate}

            />
          </div>
          <div>
            <p className={styles.filters__selectTitle}>
              Класс бронирования
            </p>
            <CustomSelect
              selected={
                classes.find(
                  (item) => item.title === tabParams.class
                ) || null
              }
              options={classes}
              onChange={(e) =>
                handleChangeClass(
                  classes.find((item) => item.value === e)
                    ?.title || ""
                )
              }
            />
          </div>
          <div>
            <p className={styles.filters__selectTitle}>Вид графика</p>
            <ToggleSwitch
              leftLabel={"Динамика\xa0бронирования"}
              rightLabel={"Динамика\xa0роста"}
              leftActive={isSeasonTypeActive}
              onChange={handleTypeChange}
            />
          </div>
        </div>
        {!(tabInfo as any[]).length ? (
          <div className={styles.noData}>
              <Skeleton height="100%" enableAnimation />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={(tabInfo as any[]) || []}>
              <XAxis dataKey="x" stroke="#4082F4" />
              <YAxis />
              <Tooltip
                wrapperStyle={{
                  width: 100,
                  backgroundColor: "#ccc"
                }}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Bar dataKey="y" fill="#4082F4" barSize={30} />
              <Brush dataKey="x" height={40}>
                <AreaChart data={(tabInfo as any[]) || []}>
                  <Area
                    type="monotone"
                    dataKey="y"
                    fill="#CADFF5"
                    fillOpacity={1}
                    strokeOpacity={0}
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </Brush>
            </BarChart>
          </ResponsiveContainer>
        )}
      </>
    );
  }
;

export default TaskOne;
